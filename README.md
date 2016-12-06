# Streaming Linked Data to Web UI

## Semantic Web London September 2016

This code is from the second [Semantic Web London](http://www.meetup.com/semantic-web-london/events/233037799/) 
meetup in September 2016.

## Developer productivity

[SemanticWeb](https://en.wikipedia.org/wiki/Semantic_Web) helps improve developer productivity, and the talk 
focused on the example of UI component reuse and streaming of the linked data to the UI.

The demo from the talk is built with [Spring Boot](https://projects.spring.io/spring-boot/) (including WebSocket support), 
[STOMP](https://stomp.github.io/), [React](https://facebook.github.io/react/), [Redux](http://redux.js.org/) and 
[Delta Ontology](https://www.w3.org/DesignIssues/Diff) for streaming graph diff information.

## Intro

Ontologies describe business domains, and using [Web Ontology Language (OWL)](https://www.w3.org/OWL/) 
allows identifying entity types and attributes using URIs. Same identifiers can be used across the business logic 
code, rules run by the rule engines, UI code and data storage systems.
Representing your data as a graph conforming to an ontology fits well with the way modern UI frameworks such 
as [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/) render the UI.

## Dependencies

You'll need [Java 8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and [Apache Maven 3.3.x](https://maven.apache.org/). 
Node and NPM are downloaded as part of the build using [frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin).

## Building

```
mvn clean package
```

## Running

```
java -jar target/streaming-linked-data-1.0.0-SNAPSHOT.jar
```

## Demo sequence for the talk

 1. Start the app.
 1. Go to (http://localhost:8080).
 1. Toggle the `WebSocket connection` switch to see the data cards rendered on the screen.
 1. Edit `data/data.ttl` to see updates streaming to the UI (once the app picks up the change).
 1. Edit `data/rules.txt` to see rules in the [Jena](https://jena.apache.org/) format applied to the entities on the stream (in this simple demo case, a new entity called "Copy of Semantic Web London" gets created every time a "Semantic Web London" is discovered).
 