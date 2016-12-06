package com.emorozov.semanticweblondon.streaminglinkeddata;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.LinkedList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.rdf.model.InfModel;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.reasoner.Reasoner;
import org.apache.jena.reasoner.ReasonerFactory;
import org.apache.jena.reasoner.ReasonerRegistry;
import org.apache.jena.reasoner.rulesys.GenericRuleReasoner;
import org.apache.jena.reasoner.rulesys.Rule;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class SowController {

	private SimpMessagingTemplate simpMessagingTemplate;

	private Model sow;
	private List<Rule> rules;

	@Autowired
	public SowController(final SimpMessagingTemplate simpMessagingTemplate) throws Exception {

		this.simpMessagingTemplate = simpMessagingTemplate;
		loadSow();
		loadRules();
		startWatcher();
	}

	@SubscribeMapping("/topic/sow")
	public void onSubscribe() throws Exception {

		log.info("Got a subscription.");

		publishSow();
	}

	@MessageMapping("/update")
	public void update(String payload) throws Exception {

		log.info("Got an update.");

		Dataset ds = DatasetFactory.create();
		try (ByteArrayInputStream bais = new ByteArrayInputStream(payload.getBytes("UTF-8"))) {
			RDFDataMgr.read(ds, bais, Lang.JSONLD);
			Model deletion = ds.getNamedModel("http://www.w3.org/2004/delta#deletion");
			Model insertion = ds.getNamedModel("http://www.w3.org/2004/delta#insertion");
			sow.remove(deletion);
			sow.add(insertion);
		}
				
		publishSow();
	}
	
	private void loadSow() throws Exception {

		log.info("Loading SOW.");

		this.sow = ModelFactory.createDefaultModel();
		this.sow.read("data/data.ttl", Lang.TURTLE.getName());
	}

	private void loadRules() throws Exception {

		log.info("Loading rules.");

		this.rules = new LinkedList<>();
		this.rules = Rule.rulesFromURL("data/rules.txt");
	}
		
	private void publishSow() throws Exception {

		log.info("Publishing SOW.");

		Reasoner owlMicroReasoner = ReasonerRegistry.getOWLMicroReasoner();
		Reasoner genericRuleReasoner = new GenericRuleReasoner(rules);
		InfModel owlInfModel = ModelFactory.createInfModel(owlMicroReasoner, sow);
		InfModel ruleInfModel = ModelFactory.createInfModel(genericRuleReasoner, owlInfModel);
		
		try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			Dataset ds = DatasetFactory.create();
			ds.setDefaultModel(ruleInfModel);
			RDFDataMgr.write(baos, ds, Lang.JSONLD);
			simpMessagingTemplate.convertAndSend("/topic/sow", baos.toString("UTF-8"));
		}
	}

	private void startWatcher() throws Exception {

		log.info("Staring watcher...");

		new Thread(() -> {
			try {

				WatchService watchService = FileSystems.getDefault().newWatchService();
				Path path = Paths.get("./data");
				path.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

				while(true) {

					WatchKey watchKey = watchService.take();
					watchKey.pollEvents();

					log.info("Change detected. Processing...");

					try {

						loadSow();
						loadRules();
						publishSow();
					} catch (Throwable th) {

						log.error("Something went wrong.", th);
					}

					watchKey.reset();

					log.info("Change processed.");
				}
			} catch (Throwable th) {

				log.error("Something went wrong. Watcher stopped.", th);
			}
		}).start();

		log.info("Watcher started.");
	}
}
