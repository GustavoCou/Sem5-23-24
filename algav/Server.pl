:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_client)).

% Predicado para encontrar o caminho entre pisos e retornar o resultado em JSON
caminhoPisos(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: *\n'),
    format('Access-Control-Allow-Headers: *\n'),
    http_parameters(Request, [pisoOrigem(PisoOr, []), pisoDestino(PisoDest, [])]),

    caminho_pisos(PisoOr, PisoDest, LEdCam, LLig),

    maplist(prolog_to_json, LLig, Result),
    reply_json(json{buildings: LEdCam, moves: Result}).

melhorCaminhoPisos(Request) :-
    cors_enable,
    format('Access-Control-Allow-Origin: *\n'),
    format('Access-Control-Allow-Headers: *\n'),
    http_parameters(Request, [pisoOrigem(PisoOr, []), pisoDestino(PisoDest, [])]),

    melhor_caminho_pisos(PisoOr, PisoDest, LLigMelhor),

    maplist(prolog_to_json, LLigMelhor, Result),
    reply_json(Result).

% Define uma rota HTTP para o predicado 'caminhoPisos'
:- http_handler(root(caminhoPisos), caminhoPisos, []).

% Define uma rota HTTP para o predicado 'melhorCaminhoPisos'
:- http_handler(root(melhorCaminhoPisos), melhorCaminhoPisos, []).

% Inicia o servidor HTTP na porta 4000
start_server(Port) :-
    http_server(http_dispatch, [port(Port)]).

:- initialization(start_server(4000)).

prolog_to_json(Term, JsonTerm) :-
    (   compound(Term)
    ->  Term =.. [Functor | Args],
        maplist(prolog_to_json, Args, JsonArgs),
        JsonTerm = json{type: Functor, args: JsonArgs}
    ;   JsonTerm = Term
    ).

% --------------------------------------------------------------------------------------

% User Story 
%?- consult("2_us510_otimo_planeamento.pl").

%PISOS CONTEMPLADOS: a, b, c,d
% Ligacoes bidirecionais entre os edificios a, b, c, d do ISEP. Edificios conectados por passagens
liga(a,b). 
liga(b,c).  
liga(b,d). 
liga(d,c). 

%EDIFICIOS + PISOS 
% O facto piso/2 tem no primeiro argumento a indicação do edifício e no segundo a lista de pisos do edifício.
pisos(c,[c1, c2, c3, c4]).
pisos(d,[d1, d2,d3]).
pisos(a, [a1, a2]).
pisos(b, [b1, b2, b3]).

%ELEVADOR = EDIFICIO + PISOS SERVIDOS POR ELEVADOR
% O facto elevador/2 tem no primeiro argumento a indicação do edifício e no segundo a lista de pisos do edifício servidos pelo elevador.
elevador(c,[c1, c2, c3, c4]).
elevador(d,[d1, d2,d3]).
elevador(a, [a1, a2]).
elevador(b, [b1, b2, b3]).

%CORREDORES = EDIFICIOS + PISOS CORRESPONDENTES COM PASSAGENS
% O facto do tipo corredor/4 tem nos dois primeiros argumentos a indicação dos dois edifícios ligados por um corredor e nos dois últimos 
% argumentos a indicação dos pisos entre os quais se estabelece essa ligação de corredor.
corredor(b,c,b3,c4).
corredor(c,d,c2,d2).
corredor(a,b,a2,b2).
corredor(b,c,b2,c3).
corredor(c,d,c3,d3).

% Metodo primeiro em profundidade com retrocesso
caminho_edificios(EdOr,EdDest,LEdCam):-caminho_edificios2(EdOr,EdDest,[EdOr],LEdCam).

caminho_edificios2(EdX,EdX,LEdInv,LEdCam):-!,reverse(LEdInv,LEdCam).
caminho_edificios2(EdAct,EdDest,LEdPassou,LEdCam):-(liga(EdAct,EdInt);liga(EdInt,EdAct)),\+member(EdInt,LEdPassou),
                                                               caminho_edificios2(EdInt,EdDest,[EdInt|LEdPassou],LEdCam).





/* Predicado caminho_pisos(PisoOr,PisoDest,LEdCam,LLig) para encontrar um caminho entre os dois pisos de dois edifícios PisoOr e PisoDest, 
usando corredores e elevadores colocando em LEdCam a lista de edifícios percorridos e em LLig uma lista com os termos de ligações por 
corredor e de ligações por elevador. */
caminho_pisos(PisoOr,PisoDest,LEdCam,LLig):-pisos(EdOr,LPisosOr),member(PisoOr,LPisosOr),
                                 pisos(EdDest,LPisosDest),member(PisoDest,LPisosDest),
                                 caminho_edificios(EdOr,EdDest,LEdCam),
                                 segue_pisos(PisoOr,PisoDest,LEdCam,LLig).

segue_pisos(PisoDest,PisoDest,_,[]).
segue_pisos(PisoDest1,PisoDest,[EdDest],[elev(PisoDest1,PisoDest)]):-
    PisoDest\==PisoDest1,
    elevador(EdDest,LPisos), member(PisoDest1,LPisos), member(PisoDest,LPisos).
segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[cor(PisoAct,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct)),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).
segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[elev(PisoAct,PisoAct1),cor(PisoAct1,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct1,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct1)),PisoAct1\==PisoAct,
    elevador(EdAct,LPisos),member(PisoAct,LPisos),member(PisoAct1,LPisos),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).



/*Predicado melhor_caminho_pisos(PisoOr,PisoDest,LLigMelhor) que dados os pisos de origem PisoOr e destino PisoDest 
encontre o caminho entre esses pisos com menos utilizações de elevador e em caso de igualdade opte pela solução com menos utilizações do corredor.*/
melhor_caminho_pisos(PisoOr,PisoDest,LLigMelhor):-
    findall(LLig,caminho_pisos(PisoOr,PisoDest,_,LLig),LLLig),
    menos_elevadores(LLLig,LLigMelhor,_,_).

menos_elevadores([LLig],LLig,NElev,NCor):-conta(LLig,NElev,NCor).
menos_elevadores([LLig|OutrosLLig],LLigR,NElevR,NCorR):-
    menos_elevadores(OutrosLLig,LLigM,NElev,NCor),
    conta(LLig,NElev1,NCor1),
    (((NElev1<NElev;(NElev1==NElev,NCor1<NCor)),!,NElevR is NElev1, NCorR is NCor1,LLigR=LLig);
     (NElevR is NElev,NCorR is NCor,LLigR=LLigM)).

conta([],0,0).
conta([elev(_,_)|L],NElev,NCor):-conta(L,NElevL,NCor),NElev is NElevL+1.
conta([cor(_,_)|L],NElev,NCor):-conta(L,NElev,NCorL),NCor is NCorL+1.

% ?- melhor_caminho_pisos(a1,b1,LLigMelhor).
% LLigMelhor = [elev(a1, a2), cor(a2, b2), elev(b2, b1)]


%---------------------------------------------------------------------------------------
% Base de Conhecimento
%MATRIZ 5*5

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%EDIFICIO D
elevadorPisos([1d, 2d, 3d], cel(1,1))

%PISO 1D
parede(1d, cel(5,1))
parede(1d, cel(1,2))
parede(1d, cel(5,2))
parede(1d, cel(5,1))
parede(1d, cel(1,4))
parede(1d, cel(3,4))
parede(1d, cel(5,4))
parede(1d, cel(1,5))
parede(1d, cel(2,5))
parede(1d, cel(3,5))
parede(1d, cel(5,5))

porta(1d, sala(d101),cel(1,3))
porta(1d, gab(d102),cel(4,2))

corredor(1d, cel(4,5))

%coluna : 1, 2, 3, 4, 5
%linha 1: E, 0, 0, 0, P
%linha 2: P, 0, 0, 0, P
%linha 3: D, 0, 0, 0, P
%linha 4: P, D, P, 0, P
%linha 5: P, P, P, C, P


%PISO 2D

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, D, D, P, C
%linha 2: P, 0, 0, 0, P
%linha 3: P, 0, 0, 0, D
%linha 4: D, 0, P, 0, D
%linha 5: P, D, D, P, P

parede(2d, cel(4,1))
parede(2d, cel(1,2))
parede(2d, cel(5,2))
parede(2d, cel(1,3))
parede(2d, cel(3,4))
parede(2d, cel(1,5))
parede(2d, cel(4,5))
parede(2d, cel(5,5))


corredor(2d, cel(5,1))

porta(2d, sala(d201),cel(2,1))
porta(2d, sala(d202),cel(3,1))
porta(2d, gab(d203),cel(5,3))
porta(2d, sala(d204),cel(1,4))
porta(2d, gab(d205),cel(5,4))
porta(2d, sala(d206),cel(2,5))
porta(2d, sala(d207),cel(3,5))


%PISO 3D

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, P, P, C, P
%linha 2: D, 0, 0, 0, C
%linha 3: D, 0, 0, 0, 0
%linha 4: P, 0, 0, 0, 0
%linha 5: P, P, D, D, 0



corredor(3d, cel(4,1))


porta(3d, sala(d301),cel(1,2))
porta(3d, sala(d302),cel(1,3))
porta(3d, sala(d303),cel(3,5))
porta(3d, sala(d304),cel(4,5))

parede(3d, cel(2,1))
parede(3d, cel(3,1))
parede(3d, cel(5,1))
parede(3d, cel(1,4))
parede(3d, cel(1,5))
parede(3d, cel(2,5))



%EDIFICIO C
elevadorPisos([1c, 2c, 3c, 4c], cel(1,1))

%PISO 1C

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, P, P, P, P
%linha 2: P, 0, 0, 0, P
%linha 3: D, 0, 0, 0, D
%linha 4: P, D, P, 0, D
%linha 5: P, D, P, D, P


porta(1c, sala(c101),cel(1,3))
porta(1c, gab(c106),cel(5,3))
porta(1c, sala(c105),cel(2,4))
porta(1c, sala(c102),cel(5,4))
porta(1c, gab(c104),cel(2,5))
porta(1c, sala(c103),cel(4,5))

parede(1c, cel(1,2))
parede(1c, cel(2,1))
parede(1c, cel(3,1))
parede(1c, cel(4,1))
parede(1c, cel(5,1))
parede(1c, cel(5,2))
parede(1c, cel(1,4))
parede(1c, cel(3,1))
parede(1c, cel(1,5))
parede(1c, cel(3,1))
parede(1c, cel(5,5))

%PISO 2C

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, P, P, D, P
%linha 2: C, 0, P, 0, D
%linha 3: 0, 0, P, 0, P
%linha 4: 0, 0, 0, 0, P
%linha 5: 0, D, D, D, P

porta(2c, sala(c201),cel(4,1))
porta(2c, sala(c202),cel(5,2))
porta(2c, gab(c203),cel(2,5))
porta(2c, sala(c204),cel(3,5))
porta(2c, gab(c205),cel(4,5))

parede(2c, cel(2,1))
parede(2c, cel(3,1))
parede(2c, cel(5,1))
parede(2c, cel(3,2))
parede(2c, cel(3,3))
parede(2c, cel(5,3))
parede(2c, cel(5,4))
parede(2c, cel(5,5))



%PISO 3C

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, D, P, D, P
%linha 2: 0, 0, 0, 0, 0
%linha 3: 0, P, 0, 0, 0
%linha 4: C, P, 0, 0, 0
%linha 5: C, 1, D, D, 0

corredor(3c, cel(1,4))
corredor(3c, cel(1,5))

porta(3c, sala(c301),cel(2,1))
porta(3c, sala(c302),cel(4,1))
porta(3c, sala(c303),cel(3,5))
porta(3c, sala(c304),cel(4,5))

parede(3c, cel(3,1))
parede(3c, cel(5,1))
parede(3c, cel(2,3))
parede(3c, cel(2,4))
parede(3c, cel(2,5))



%PISO 4C

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, 0, D, P, P
%linha 2: C, 0, 0, 0, P
%linha 3: P, 0, 0, 0, 0
%linha 4: 0, 0, D, 0, 0
%linha 5: 0, D, P, D, P

corredor(4c, cel(1,2))

porta(4c, sala(c401),cel(3,1))
porta(4c, gab(c402),cel(3,4))
porta(4c, gab(c403),cel(2,5))

parede(4c, cel(4,1))
parede(4c, cel(5,1))
parede(4c, cel(5,2))
parede(4c, cel(1,3))
parede(4c, cel(3,5))
parede(4c, cel(5,5))


%EDIFICIO A
%PISO 1A

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, P, D, P, P
%linha 2: P, 0, 0, 0, D
%linha 3: P, 0, 0, 0, P
%linha 4: D, 0, 0, 0, P
%linha 5: P, P, P, P, P

elevadorPisos([1a, 2a], cel(1,1))

porta(1a, sala(a101),cel(1,4))
porta(1a, gab(a102),cel(3,1))
porta(1a, sala(c103),cel(5,2))


parede(1a, cel(1,1))
parede(1a, cel(2,1))
parede(1a, cel(4,1))
parede(1a, cel(5,1))
parede(1a, cel(1,2))
parede(1a, cel(1,3))
parede(1a, cel(5,3))
parede(1a, cel(5,4))
parede(1a, cel(1,5))
parede(1a, cel(3,5))
parede(1a, cel(4,5))
parede(1a, cel(5,5))
parede(1a, cel(2,5))


%PISO 2A

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, D, D, D, 0
%linha 2: D, 0, 0, 0, E
%linha 3: D, 0, 0, 0, 0
%linha 4: D, 0, 0, 0, 0
%linha 5: D, D, D, D, P


parede(2a, cel(5,5))

corredor(2a, cel(5,2))

porta(2a, sala(a201),cel(1,1))
porta(2a, sala(a202),cel(2,1))
porta(2a, sala(a203),cel(3,1))
porta(2a, gab(a204),cel(4,1))
porta(2a, gab(a205),cel(1,2))
porta(2a, sala(a206),cel(1,3))
porta(2a, sala(a207),cel(1,4))
porta(2a, gab(a208),cel(1,5))
porta(2a, sala(a209),cel(2,5))
porta(2a, gab(a210),cel(3,5))
porta(2a, sala(a211),cel(4,5))















%PISO 1B

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, D, D, P, D
%linha 2: P, 0, 0, 0, D
%linha 3: P, 0, P, 0, P
%linha 4: P, 0, P, 0, P
%linha 5: P, D, P, P, D

elevadorPisos([1b, 2b, 3b], cel(1,1))

porta(1b, sala(b101),cel(2,1))
porta(1b, sala(b102),cel(3,1))
porta(1b, sala(b103),cel(5,1))
porta(1b, gab(b104),cel(5,2))
porta(1b, sala(b105),cel(2,5))
porta(1b, sala(b106),cel(5,5))


parede(1b , cel(5,1))
parede(1b , cel(4,1))
parede(1b , cel(1,2))
parede(1b , cel(1,3))
parede(1b , cel(3,3))
parede(1b , cel(5,3))
parede(1b , cel(1,4))
parede(1b , cel(3,4))
parede(1b , cel(1,5))
parede(1b , cel(3,5))
parede(1b , cel(4,5))
















%PISO 2B

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, P, D, P, D
%linha 2: C, P, 0, D, 0
%linha 3: 0, D, 0, D, 0
%linha 4: 0, 0, 0, 0, C
%linha 5: 0, D, D, C, 0

porta(2b, sala(b201),cel(3,1))
porta(2b, sala(b202),cel(5,1))
porta(2b, gab(b203),cel(2,3))
porta(2b, gab(b204),cel(4,3))
porta(2b, sala(b205),cel(2,5))
porta(2b, sala(b206),cel(3,2))


parede(2b, cel(1,1))
parede(2b, cel(2,1))
parede(2b, cel(4,1))
parede(2b, cel(2,2))



corredor(2b, cel(1,2))
corredor(2b, cel(5,4))
corredor(2b, cel(4,5))












%PISO 3B

%ELEVADOR -> 3
%CORREDORES DE ACESS0 -> 4
%PAREDE -> 1
%PORTA -> 2

%coluna : 1, 2, 3, 4, 5
%linha 1: E, P, 0, D, P
%linha 2: P, D, 0, 0, P
%linha 3: P, 0, 0, 0, P
%linha 4: P, 0, 0, 0, 0
%linha 5: P, P, D, D, C



corredor(2b, cel(5,5))

porta(3b, sala(b301),cel(4,1))
porta(3b, gab(b302),cel(2,2))
porta(3b, gab(b303),cel(2,5))
porta(3b, sala(b304),cel(4,5))

parede(3b, cel(1,1))
parede(3b, cel(2,1))
parede(3b, cel(5,1))
parede(3b, cel(1,2))
parede(3b, cel(5,1))
parede(3b, cel(1,3))
parede(3b, cel(5,3))
parede(3b, cel(1,4))
parede(3b, cel(1,5))
parede(3b, cel(1,5)).