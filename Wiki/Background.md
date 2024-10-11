## Contents
- [Architecture Background](#architecture-background)
	- [Problem Background](#problem-background)
		- [System Overview](#system-overview)
		- [Context](#context)
		- [Driving Requirements](#driving-requirements)
			- [Functional requirements](#functional-requirements)
			- [Quality attributes](#quality-attributes)
				- [Funcionalidade](#funcionalidade)
				- [Usabilidade](#usabilidade)
				- [Confiabilidade (Reliability)](#confiabilidade-reliability)
				- [Desempenho (Performance)](#desempenho-performance)
				- [Suportabilidade](#suportabilidade)
				- [Design constraints](#design-constraints)
				- [Implementation constraints](#implementation-constraints)
				- [Interface constraints](#interface-constraints)
				- [Physical constraints](#physical-constraints)
	- [Solution Background](#solution-background)
		- [Architectural Approaches](#architectural-approaches)
		- [Analysis Results](#analysis-results)
		- [Mapping Requirements to Architecture](#mapping-requirements-to-architecture)

# Architecture Background

> Architecture Background provides information about the software architecture, by:
> - describing the background and rationale for the software architecture;
> - explaining the constraints and influences that led to the current architecture;
> - describing the major architectural approaches that have been utilized in the architecture.
  
## Problem Background

> The sub-parts of this section explain the constraints that provided the significant influence over the architecture.

### System Overview

> This section describes the general function and purpose for the system or subsystem whose architecture is described in this SAD.

Pretende-se o desenvolvimento de um protótipo para um sistema de execução de tarefas de uma frota de robots e drones no interior do campus.


### Context

> This section describes the goals and major contextual factors for the software architecture. The section includes a description of the role software architecture plays in the life cycle, the relationship to system engineering results and artifacts, and any other relevant factors.

Pretende-se desenvolver uma solução para a gestão de uma frota de drones e robots que possam executar tarefas no interior do seu campus. Para além disso, pretende-se que o gestor de frota configure o robots e drones existentes para que possam mais tarde ser utilizados na execução de tarefas.

Numa fase inicial do protótipo assume-se que os robots podem executar apenas tarefas de transporte de um objeto de um ponto para outro e a vigilância de segurança de um piso de um edifício efetuando recolha de imagens.

*NB: Contudo, o sistema aqui pedido é uma simplificação daquilo que é um sistema de gestão de tarefas de robots e drones, pelo que são assumidas simplificações para tornar o projeto exequível neste âmbito (i.e. 5º semestre da LEI).*

Este SAD serve de base para debate sobre o sistema a construir (a implementar, testar e implantar), e pretende-se que esteja alinhado com o sistema construído. Para além do óbvio na descrição duma arquitetura de software, deve identificar alternativas de design e ponto de variação.

### Driving Requirements

> This section lists the functional requirements, quality attributes and design constraints. It may point to a separate requirements document.

#### Functional requirements

1. Criar edifício.
2. Editar edifício.
3. Listar todos os edifícios.
4. Listar edifícios com min e max de pisos.
5. Criar piso de edifício.
6. Editar informação de piso de edifício.
7. Listar todos os pisos de um edifício.
8. Listar pisos de edifício com passagem para outros edifícios.
9. Carregar mapa de piso.
10. Criar passagem entre edifícios.
11. Editar passagem entre edifícios.
12. Listar passagens entre 2 edifícios.
13. Criar elevador em edifício.
14. Editar elevador em edifício.
15. Listar elevadores em edifício.
16. Listar pisos de edifício servidos por elevador.
17. Criar sala de piso de edifício.
18. Como gestor de frota pretendo adicionar um novo tipo de robot indicando a sua designação e que tipos de tarefas pode executar da lista prédefinida de tarefas.
19. Como gestor de frota pretendo adicionar um novo robot à frota indicando o seu tipo, designação, etc.
20. Como gestor de frota pretendo inibir um robot.
21. Como gestor de frota pretendo consultar todos os robots da frota.
22. Como gestor de frota pretendo pesquisar todos os robots da frota por designação ou tarefa que pode executar.

<Modelo de casos de uso/>

![DUC](diagramas/DUC.png)

#### Quality attributes

Os atributos de qualidade são categorizados e sistematizados segundo o modelo [FURPS+](https://pt.wikipedia.org/wiki/FURPS).

##### Funcionalidade

1. Cada sistema só poderá aceder aos dados que lhe dizem respeito.
2. Deve ser auditada e verificada a integridade da informação a que os sistemas acedem.
3. Com vista à necessidade de saber e necessidade de conhecer, toda a informação deve estar protegida de acessos indevidos. Ou seja, o princípio de minimização de acesso ao que é essencial para cada utilizador/aplicação, criação de túneis para transferência de informação, avaliação da integridade de dados e aplicações, e encriptação/minimização dos dados.
4. Uma vez que o módulo de gestão de tarefas se encontra virado para o exterior, é necessário ter especial atenção com a privacidade e proteção de dados à luz do RGPD. Assim é necessário que o sistema cumpra a legislação em vigor e, em especial, disponibilize as informações legais e informe o utilizador aquando do seu registo, bem como permita aceder e cancelar a sua conta nos casos e nas condições legalmente permitidas.

##### Usabilidade

1. A SPA deve permitir acesso a todos os módulos do sistema: master data, planeamento e visualização, bem como RGPD.

<!-- 2.  No âmbito do projeto atual, a administração de utilizadores pode ser efetuada diretamente na base de dados não sendo necessário um módulo de gestão de utilizadores. -->

##### Confiabilidade (Reliability)

n/a

##### Desempenho (Performance)

n/a

##### Suportabilidade

<!-- 1. Embora não esteja no âmbito atual do projeto, deve ser levado em conta na arquitetura da solução, a extensão futura para aplicações móveis. -->

##### Design constraints

1. O sistema deve ser composto por uma aplicação web do tipo Single Page Application (SPA) que permite aos utilizadores autorizados acederem aos diferentes módulos da aplicação, bem como por um conjunto de serviços que implementem as componentes de regras de negócio necessárias para o funcionamento da aplicação web.

De um modo geral, as principais funcionalidades de cada módulo são as seguintes:

- Master data – permite a gestão da informação relacionada com as tarefas (nós, percursos), tipos de robots, tipos de tarefas, linhas e percursos.
- Planeamento – <!-- com base nos percursos existentes planear as trocas de tripulações nos pontos de rendição. Planear os serviços de tripulantes com base nos serviços de viatura. Consome a informação gerida no módulo master data e publica informação do planeamento para o módulo de visualização. -->
- Visualizador 3D –  permite a visualização 2D e 3D da rede, a navegação pela cena e a consulta gráfica de informação sobre as viagens. Consome a informação gerida no módulo master data e no módulo
- UI – interface com o utilizador
- Utentes + RGPD – gestão de informação dos utilizadores finais “utentes” e seus consentimentos no âmbito do RGPD

<!-- 9.  No âmbito do projeto atual, a administração de utilizadores pode ser efetuada diretamente na base de dados não sendo necessário um módulo de gestão de utilizadores. -->

2.  Embora não esteja no âmbito atual do projeto, deve ser levado em conta na arquitetura da solução, a extensão futura para aplicações móveis.

##### Implementation constraints

1.   Todos os módulos devem fazer parte do código fonte da mesma SPA e serem disponibilizados como um único artefacto.

##### Interface constraints

<!-- 1.  A SPA deve permitir acesso a todos os módulos do sistema: master data, planeamento e visualização, bem como RGPD. (repetida porque diz respeito a duas categrorias)
2.  O módulo de Planeamento deve consumir dados de rede através da API do master data
3.  O módulo de Planeamento deve consumir dados de viagens através da API do master data
4.  O módulo de Visualização deve consumir dados de rede através da API do master data
5.  O módulo de Visualização deve consumir dados de viagens através da API do master data "viagens"
6.  O módulo de Visualização deve consumir dados de serviços de tripulante através da API do planeamento -->

[...]

##### Physical constraints

<!-- 1. Existem dois servidores em load balancing, onde estão instaladas as aplicações, serviços e as bases de dados e que se encarregam do armazenamento da informação.

2. Existem ainda dois servidores em failover que distribuem os endereços a todos os sistemas e se encarregam da autenticação de sistemas e utilizadores (DHCP, DNS (se aplicável) e autenticação de servidores, e eventualmente um servidor Kerberos).

3. Algumas das aplicações devem ser implantadas *on premises* e outras em IaaS e PaaS (*on cloud*). Cf. requisitos específicos das UC por sprint.
 -->

## Solution Background

> The sub-parts of this section provide a description of why the architecture is the way that it is, and a convincing argument that the architecture is the right one to satisfy the behavioral and quality attribute goals levied upon it.

### Architectural Approaches

> This section provides a rationale for the major design decisions embodied by the software architecture. It describes any design approaches applied to the software architecture, including the use of architectural styles or design patterns, when the scope of those approaches transcends any single architectural view. The section also provides a rationale for the selection of those approaches. It also describes any significant alternatives that were seriously considered and why they were ultimately rejected. The section describes any relevant COTS issues, including any associated trade studies.

Baseado nos requisitos não funcionais e restrições de design, serão adotadas as seguintes abordagens/padrões/estilos:

<!-- - Client-Server, porque cada um dos "módulos" MDR, MDV, Planeamento são aplicações servidoras de outras aplicações clientes (e.g. MDR é servidor de MDV e UI, MDV é servidor de Planeamento e UI, e Planeamento é servidor de UI);
- Web Application, em que o frontend é desempenhado por uma SPA (Single Page Application), e que o backend é desempenhado pelos módulos MDR, MDV e Planeamento;
- SOA, porque os servidores (cf. anterior) deverão disponibilizar API, e particularmemte API para serem usadas na web, disponibilizados serviços para os clientes respetivos. Serão adotados os nível 0, 1 e 2 do [Modelo de Maturidade de Richardson](https://martinfowler.com/articles/richardsonMaturityModel.html) aplicado a REST;
- N-Tier, pois as várias aplicações devem ser implantadas em diferentes máquinas *on premises* e IaaS e PaaS (*on cloud*), de acordo com os requisitos não funcionais;
- Layered architecture, mais especificamente Onion Architecture, por razões académicas. -->

Outras abordagens/estilos/padrões, como e.g. interligação entre aplicações baseado em mensagens-eventos foram desconsideradas para não violar os requisitos e restrições definidos, mas também por questões académicas.

### Analysis Results

> This section describes the results of any quantitative or qualitative analyses that have been performed that provide evidence that the software architecture is fit for purpose. If an Architecture Tradeoff Analysis Method evaluation has been performed, it is included in the analysis sections of its final report. This section refers to the results of any other relevant trade studies, quantitative modeling, or other analysis results.

<!-- Não existem por agora resultados de análise ou avaliação. Estudos qualitativos acerca dos estilos/padrões adotados (nomeadamente Onion em MDR e MDV, mas também Dependency Injection na UI), permitem empiricamente advogar que a manutenibilidade, evolutabilidade e testabilidade do software são elevadas, ao mesmo tempo que permitem atingir as funcionalidades desejadas. -->

### Mapping Requirements to Architecture

> This section describes the requirements (original or derived) addressed by the software architecture, with a short statement about where in the architecture each requirement is addressed.
