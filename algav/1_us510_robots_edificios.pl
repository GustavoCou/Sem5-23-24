%?- consult("1_us510_robots_edificios.pl").

%ALGORITMOS PARA MOVIMENTAÇAO ENTRE PISOS 

%BASE DE CONHECIMENTO
% O facto piso/2 
%1º argumento: indicação do edifício
%2º argumento: lista de pisos do edifício.
pisos(b,[b1,b2,b3]).
pisos(g,[g2,g3]).
pisos(h,[h1,h2,h3]).
pisos(i,[i1,i2,i3]).

% O facto elevador/2
%1º argumento: a indicação do edifício
%2º argumento: a lista de pisos do edifício servidos pelo elevador.
elevador(b,[b1,b2,b3]).
elevador(g,[g2,g3]).
elevador(i,[i1,i2,i3]).

% O facto do tipo corredor/4
%1º argumento e 2º argumento: indicação dos dois edifícios conetados por um corredor
%3º argumento e 4º argumento: indicação dos pisos entre os quais se estabelece essa ligação de corredor.
corredor(b,g,b2,g2).
corredor(b,g,b3,g3).
corredor(b,i,b3,i3).
corredor(g,h,g2,h2).
corredor(g,h,g3,h3).
corredor(h,i,h2,i2).

%LIGACOES ENTRE EDIFICIOS
liga(b,g). %Liga por corredor em P2 e em P3. Não liga por corredor de P1 para P1 porque é caminho descoberto.
liga(g,h). %Liga por corredor em P2 e em P3 (à largura do edificio). 
liga(b,i). %Liga por corredor em P3.
liga(i,h). %Liga por corredor em P2





%PREDICADOS
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

% ?- melhor_caminho_pisos(i1,b3,LLigMelhor).
% LLigMelhor = [elev(i1, i3), cor(i3, b3)].






% Metodo primeiro em profundidade com retrocesso
caminho_edificios(EdOr,EdDest,LEdCam):-caminho_edificios2(EdOr,EdDest,[EdOr],LEdCam).

caminho_edificios2(EdX,EdX,LEdInv,LEdCam):-!,reverse(LEdInv,LEdCam).
caminho_edificios2(EdAct,EdDest,LEdPassou,LEdCam):-(liga(EdAct,EdInt);liga(EdInt,EdAct)),\+member(EdInt,LEdPassou),
                                                               caminho_edificios2(EdInt,EdDest,[EdInt|LEdPassou],LEdCam).

% Encontrar um caminho entre edificios do EdOr para o EdDest
%?- caminho_edificios(i,h,LEdCam).
% LEdCam = [i, h].
% true
% LEdCam = [i, b, g, h].
% true




todos_caminhos_edificios(EdOr,EdDest,LTCamEd):-findall(LEdCam,caminho_edificios(EdOr,EdDest,LEdCam),LTCamEd).

%Encontrar todos os caminhos entre edificios
%?- todos_caminhos_edificios(i,h,LTCamEd).
% LTCamEd = [[i, h], [i, b, g, h]].



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



% Foram considerados todos os caminhos possiveis de I1 para B3 com recurso aos corredores e aos elevadores.
% ?- caminho_pisos(i1,b3,LEdCam,LLig).
%LEdCam = [i, b],
% LLig = [elev(i1, i3), cor(i3, b3)];
%LEdCam = [i, h, g, b],
% LLig = [elev(i1, i2), cor(i2, h2), cor(h2, g2), cor(g2, b2), elev(b2, b3)];
%LEdCam = [i, h, g, b],
% LLig = [elev(i1, i2), cor(i2, h2), cor(h2, g2), elev(g2, g3), cor(g3, b3)];






