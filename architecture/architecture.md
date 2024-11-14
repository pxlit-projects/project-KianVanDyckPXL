# Architecture
![Project Architecture](https://github.com/pxlit-projects/project-KianVanDyckPXL/blob/main/architecture/JavaSchema.png)

# Systeemarchitectuur Overzicht
Dit README geeft een overzicht van de systeemarchitectuur, waarbij de componenten en hun interacties binnen het systeem worden beschreven. De architectuur is opgedeeld in frontend- en backend-services, met gebruik van microservices en berichtgestuurde communicatie voor schaalbaarheid en modulariteit.

Architectuurdiagram
Hieronder worden de componenten in de architectuur beschreven:

<!-- Vervang "diagram.png" door het daadwerkelijke pad als dit README wordt geüpload met de afbeelding -->

# Componenten
# 1. Frontend
Angular Frontend: De gebruikersinterface, gebouwd met Angular, waarmee gebruikers interactie hebben met het systeem.

# 2. Backend Services
**API Gateway**: Fungeert als het toegangspunt tot de backend en leidt verzoeken van de frontend door naar de juiste microservices. Het helpt bij het beheren van load balancing, authenticatie en service discovery.

**PostService** : Verantwoordelijk voor het beheren van bewerkingen met betrekking tot berichten. Communiceert met andere services zoals ReviewService en CommentService met behulp van OpenFeign, een declaratieve REST-client.

**ReviewService**: Beheert reviews die aan berichten zijn gekoppeld. Communiceert met PostService en CommentService om gerelateerde informatie op te halen. Gebruikt OpenFeign voor communicatie tussen services.

**CommentService**: Beheert reacties op berichten en reviews. Deze service werkt samen met PostService en ReviewService om relevante informatie voor elke reactie op te halen.

**Message Bus / RabbitMQ**: Behandelt asynchrone communicatie tussen services met behulp van berichtwachtrijen. Bijvoorbeeld, wanneer bepaalde gebeurtenissen worden geactiveerd in de PostService, kunnen ze berichten sturen naar de NotificationService om gebruikers op de hoogte te stellen.

**NotificationService**: Verantwoordelijk voor het versturen van meldingen naar gebruikers op basis van gebeurtenissen van andere services. Luistert naar berichten van RabbitMQ om meldingen te verwerken.

**ConfigService**: Beheert configuratie-instellingen en biedt gecentraliseerde configuratie voor alle services.

**DiscoveryService**: Maakt service discovery mogelijk, zodat services elkaar kunnen vinden en efficiënt kunnen communiceren. Dit helpt bij load balancing en schaalbaarheid.

# Communicatiestromen
**OpenFeign**: Wordt gebruikt voor synchrone communicatie tussen PostService, ReviewService en CommentService. Hiermee kunnen efficiënte RESTful-aanroepen binnen het systeem worden uitgevoerd, waardoor services direct gegevens bij elkaar kunnen opvragen.

**RabbitMQ**: Zorgt voor asynchrone communicatie, vooral tussen services die real-time meldingen vereisen. Bijvoorbeeld, gebeurtenissen van ReviewService en CommentService worden via RabbitMQ naar de NotificationService gestuurd.

# Service Discovery
De DiscoveryService helpt bij het dynamisch vinden van instanties van elke microservice, wat vooral nuttig is in gedistribueerde omgevingen. Services communiceren met DiscoveryService om zich te registreren en om andere instanties te vinden.

# Configuratiebeheer
ConfigService slaat configuraties voor elke microservice op en beheert deze. Deze centralisatie maakt het eenvoudiger om updates door te voeren en zorgt voor consistentie in het hele systeem.
