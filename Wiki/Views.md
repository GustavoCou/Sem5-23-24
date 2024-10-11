	## Contents
- [Views](#views)
	- [Introduction](#introduction)
	- [Nível 1](#nível-1)
		- [Vista Lógica](#vista-lógica)
		- [Vista de Processos](#vista-de-processos)
	- [Nível 2](#nível-2)
		- [Vista Lógica](#vista-lógica-1)
		- [Vista de Processos](#vista-de-processos-1)
		- [Vista de Implementação](#vista-de-implementação)
		- [Vista Física](#vista-física)
	- [Nível 3 (MDR)](#nível-3-mdr)
		- [Vista Lógica](#vista-lógica-2)
		- [Vista de Processos](#vista-de-processos-2)
		- [Vista de Implementação](#vista-de-implementação-1)
		- [Vista Física](#vista-física-1)
	- [Nível 3 (UI)](#nível-3-ui)
		- [Vista Lógica](#vista-lógica-3)
		- [Vista de Processos](#vista-de-processos-3)
		- [Vista de Implementação](#vista-de-implementação-2)
		- [Vista Física](#vista-física-2)
	- [Nível 3 (MDV)](#nível-3-mdv)
		- [Vista Lógica](#vista-lógica-4)
		- [Vista de Processos](#vista-de-processos-4)
		- [Vista de Implementação](#vista-de-implementação-3)
		- [Vista Física](#vista-física-3)
	- [Nível 3 (Planeamento)](#nível-3-planeamento)
		- [Vista Lógica](#vista-lógica-5)
		- [Vista de Processos](#vista-de-processos-5)
		- [Vista de Implementação](#vista-de-implementação-4)
		- [Vista Física](#vista-física-4)

# Views

## Introduction

Será adotada a combinação de dois modelos de representação arquitetural: C4 e 4+1.

O Modelo de Vistas 4+1 [[Krutchen-1995]](References.md#Kruchten-1995) propõe a descrição do sistema através de vistas complementares permitindo assim analisar separadamente os requisitos dos vários stakeholders do software, tais como utilizadores, administradores de sistemas, project managers, arquitetos e programadores. As vistas são deste modo definidas da seguinte forma:

- Vista lógica: relativa aos aspetos do software visando responder aos desafios do negócio;
- Vista de processos: relativa ao fluxo de processos ou interações no sistema;
- Vista de desenvolvimento: relativa à organização do software no seu ambiente de desenvolvimento;
- Vista física: relativa ao mapeamento dos vários componentes do software em hardware, i.e. onde é executado o software;
- Vista de cenários: relativa à associação de processos de negócio com atores capazes de os espoletar.

O Modelo C4 [[Brown-2020]](References.md#Brown-2020)[[C4-2020]](References.md#C4-2020) defende a descrição do software através de quatro níveis de abstração: sistema, contentor, componente e código. Cada nível adota uma granularidade mais fina que o nível que o antecede, dando assim acesso a mais detalhe de uma parte mais pequena do sistema. Estes níveis podem ser equiparáveis a mapas, e.g. a vista de sistema corresponde ao globo, a vista de contentor corresponde ao mapa de cada continente, a vista de componentes ao mapa de cada país e a vista de código ao mapa de estradas e bairros de cada cidade.
Diferentes níveis permitem contar histórias diferentes a audiências distintas.

Os níveis encontram-se definidos da seguinte forma:
- Nível 1: Descrição (enquadramento) do sistema como um todo;
- Nível 2: Descrição de contentores do sistema;
- Nível 3: Descrição de componentes dos contentores;
- Nível 4: Descrição do código ou partes mais pequenas dos componentes (e como tal, não será abordado neste DAS/SAD).

Pode-se dizer que estes dois modelos se expandem ao longo de eixos distintos, sendo que o Modelo C4 apresenta o sistema com diferentes níveis de detalhe e o Modelo de Vista 4+1 apresenta o sistema de diferentes perspetivas. Ao combinar os dois modelos torna-se possível representar o sistema de diversas perspetivas, cada uma com vários níveis de detalhe.

Para modelar/representar visualmente, tanto o que foi implementado como as ideias e alternativas consideradas, recorre-se à Unified Modeling Language (UML) [[UML-2020]](References.md#UML-2020) [[UMLDiagrams-2020]](References.md#UMLDiagrams-2020).

## Nível 1
### Vista Lógica

![Vista Logica](diagramas\nivel1\vista_nivel_1.svg)

### Vista de Processos

#### SSD US150
![US150](diagramas/nivel1/US150.svg)

#### SSD US160
![US160](diagramas/nivel1/US160.svg)

#### SSD US170
![US170](diagramas/nivel1/US170.svg)

#### SSD US180
![US180](diagramas/nivel1/US180.svg)

#### SSD US190
![US190](diagramas/nivel1/US190.svg)

#### SSD US200
![US200](diagramas/nivel1/US200.svg)

#### SSD US210
![US210](diagramas/nivel1/US210.svg)

#### SSD US220
![US220](diagramas/nivel1/US220.svg)

#### SSD US230
![US230](diagramas/nivel1/US230.svg)

#### SSD US240
![US240](diagramas/nivel1/US240.svg)

#### SSD US250
![US250](diagramas/nivel1/US250.svg)

#### SSD US260
![US260](diagramas/nivel1/US260.svg)

#### SSD US270
![US270](diagramas/nivel1/US270.svg)

#### SSD US300
![US300](diagramas/nivel1/US300.svg)

#### SSD US310
![US310](diagramas/nivel1/US310.svg)

#### SSD US350
![US350](diagramas/nivel1/US350.svg)

#### SSD US360
![US360](diagramas/nivel1/US360_SSD.svg)

#### SSD US370
![US370](diagramas/nivel1/US370_SSD.svg)


#### SSD US460
![US460](diagramas/nivel1/US460/US460.svg)

#### SSD US10
![US10](diagramas/nivel1/US10_SSD.svg)

#### SSD US470
![US470](diagramas/nivel1/US470_SSD.svg)

#### SSD US80
![US80](diagramas/nivel1/US80.svg)

#### SSD US480
![US480](diagramas/nivel1/US480.svg)


### Diagrama de Casos de Uso
![DUC](diagramas/nivel1/DUC.svg)

## Nível 2
### Vista Lógica

![Vista Logica](diagramas/nivel2/vistalogica.svg)



### Vista de Processos

#### SSD US150
![US150](diagramas/nivel2/US150.svg)

#### SSD US160
![US160](diagramas/nivel2/US160.svg)

#### SSD US170
![US170](diagramas/nivel2/US170.svg)

#### SSD US180
![US180](diagramas/nivel2/US180.svg)

#### SSD US190
![US190](diagramas/nivel2/US190.svg)

#### SSD US200
![US200](diagramas/nivel2/US200.svg)

#### SSD US210
![US210](diagramas/nivel2/US210.svg)

#### SSD US220
![US220](diagramas/nivel2/US220.svg)

#### SSD US230
![US230](diagramas/nivel2/US230.svg)

#### SSD US240
![US240](diagramas/nivel2/US240.svg)

#### SSD US250
![US250](diagramas/nivel2/US250.svg)

#### SSD US260
![US260](diagramas/nivel2/US260.svg)

#### SSD US270
![US270](diagramas/nivel2/US270.svg)

#### SSD US290
![US290](diagramas/nivel2/US290.svg)

#### SSD US300
![US300](diagramas/nivel2/US300.svg)

#### SSD US310
![US310](diagramas/nivel2/US310.svg)

#### SSD US350
![US350](diagramas/nivel2/US350.svg)

#### SSD US360
![US360](diagramas/nivel2/US360_SD.svg)

#### SSD US370
![US370](diagramas/nivel2/US370_SD.svg)

#### SSD US380
![US380](diagramas/nivel2/US380_SD.svg)


#### SSD US460
![US460](diagramas/nivel2/US460/US460.svg)


#### SSD US10
![US10](diagramas/nivel2/US10_SSD.svg)

#### SSD US470
![US470](diagramas/nivel2/US470_SSD.svg)

#### SSD US80
![US80](diagramas/nivel2/US80.svg)

#### SSD US480
![US480](diagramas/nivel2/US480.svg)


### Vista de Implementação
![Vista Implementação](diagramas/nivel2/nivel2implementacao.svg)

### Vista Física
![Vista Implementação](diagramas/nivel2/VFisicaN2.svg)

### Vista Lógica e Vista de Implementação
![JuncaoN2](diagramas/nivel2/JuncaoN2.svg)


## Nível 3 (MDC)
### Vista Lógica
Alternativa baseada numa arquitetura por camadas sobrepostas:
![Vista Lógica](diagramas/nivel3/MDC/alt.svg)

Alternativa baseada numa arquitetura por camadas concêntricas (Onion):
![Vista Lógica](diagramas/nivel3/MDC/vista.svg)

A alternativa Onion será a adotada.

### Vista de Processos

#### SSD US150
![US150](diagramas/nivel3/MDC/US150.svg)

#### SSD US160
![US160](diagramas/nivel3/MDC/US160.svg)

#### SSD US170
![US170](diagramas/nivel3/MDC/US170.svg)

#### SSD US180
![US180](diagramas/nivel3/MDC/US180.svg)

#### SSD US190
![US190](diagramas/nivel3/MDC/US190.svg)

#### SSD US200
![US200](diagramas/nivel3/MDC/US200.svg)

#### SSD US210
![US210](diagramas/nivel3/MDC/US210.svg)

#### SSD US220
![US220](diagramas/nivel3/MDC/US220.svg)

#### SSD US230
![US230](diagramas/nivel3/MDC/US230.svg)

#### SSD US240
![US240](diagramas/nivel3/MDC/US240.svg)

#### SSD US250
![US250](diagramas/nivel3/MDC/US250.svg)

#### SSD US260
![US260](diagramas/nivel3/MDC/US260.svg)

#### SSD US270
![US270](diagramas/nivel3/MDC/US270.svg)

#### SSD US290
![US290](diagramas/nivel3/MDC/US290.svg)

#### SSD US300
![US300](diagramas/nivel3/MDC/US300.svg)

#### SSD US310
![US310](diagramas/nivel3/MDC/US310.svg)

#### SSD US350
![US350](diagramas/nivel3/MDR/US350.svg)

#### SSD US360
![US370](diagramas/nivel3/MDC/US370.svg)

#### SSD US380
![US380](diagramas/nivel3/MDC/US380.svg)

#### SSD US10
![US10](diagramas/nivel3/MDU/US10_SSD.svg)

#### SSD US80
![US80](diagramas/nivel3/MDU/US80.svg)

#### SSD US470
![US470](diagramas/nivel3/MDT/US470_SSD.svg)

#### SSD US80
![US80](diagramas/nivel3/MDU/US80.svg)

#### SSD US480
![US480](diagramas/nivel3/MDT/US480.svg)



#### SSD US460 SPA
![US460](diagramas/nivel3/MDC/US460/US460_SPA.svg)


#### SSD US460 TaskAPI
![US460](diagramas/nivel3/MDC/US460/US460_TaskAPI.svg)
### Vista de Implementação
![Implementação](diagramas/nivel3/MDC/implementacao.svg)

![Implementação](diagramas/nivel3/MDC/implementacaoN3UI.svg)

