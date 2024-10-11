%?- consult("3_us515_analise_complexidade.pl").

%Documentação de apoio3
%ALGORITMOS E BASE DE CONHECIMENTO PARA ESTUDO DE complexidade

%m(col,lin,valor) m 7*7 

%coluna :1,2,3,4,5,6,7
%linha 1:1,1,1,1,1,1,1
%linha 2:0,0,0,0,0,0,0
%linha 3:0,0,0,0,0,0,0
%linha 4:0,0,0,0,0,0,0
%linha 5:1,1,1,1,0,0,0
%linha 6:1,1,1,1,0,0,0
%linha 7:1,1,1,1,0,0,0

%ou

m(1,1,1).
m(2,1,1).
m(3,1,1).
m(4,1,1).
m(5,1,1).
m(6,1,1).
m(7,1,1).


m(1,2,0).
m(2,2,0).
m(3,2,0).
m(4,2,0).
m(5,2,0).
m(6,2,0).
m(7,2,0).


m(1,3,0).
m(2,3,0).
m(3,3,0).
m(4,3,0).
m(5,3,0).
m(6,3,0).
m(7,3,0).


m(1,4,0).
m(2,4,0).
m(3,4,0).
m(4,4,0).
m(5,4,0).
m(6,4,0).
m(7,4,0).


m(1,5,1).
m(2,5,1).
m(3,5,1).
m(4,5,1).
m(5,5,0).
m(6,5,0).
m(7,5,0).


m(1,6,1).
m(2,6,1).
m(3,6,1).
m(4,6,1).
m(5,6,0).
m(6,6,0).
m(7,6,0).


m(1,7,1).
m(2,7,1).
m(3,7,1).
m(4,7,1).
m(5,7,0).
m(6,7,0).
m(7,7,0).

%Cria grafo
:-dynamic ligacel/2.

cria_grafo(_,0):-!.
cria_grafo(Col,Lin):-cria_grafo_lin(Col,Lin),Lin1 is Lin-
1,cria_grafo(Col,Lin1).

cria_grafo_lin(0,_):-!.
cria_grafo_lin(Col,Lin):-m(Col,Lin,0),!,
        ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((m(ColS,Lin,0),assertz(ligacel(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((m(ColA,Lin,0),assertz(ligacel(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((m(Col,LinS,0),assertz(ligacel(cel(Col,Lin),cel(Col,LinS)));true)),
    ((m(Col,LinA,0),assertz(ligacel(cel(Col,Lin),cel(Col,LinA)));true)),
    
    ((m(ColS, LinS, 0), m(ColS, Lin, 0), m(Col, LinS, 0), assertz(ligacelm(cel(Col, Lin), cel(ColS, LinS)));true)),
    ((m(ColA, LinS, 0), m(ColA, Lin, 0), m(Col, LinS, 0), assertz(ligacelm(cel(Col, Lin), cel(ColA, LinS)));true)),
    ((m(ColS, LinA, 0), m(ColS, Lin, 0), m(Col, LinA, 0), assertz(ligacelm(cel(Col, Lin), cel(ColS, LinA)));true)),
    ((m(ColA, LinA, 0), m(ColA, Lin, 0), m(Col, LinA, 0), assertz(ligacelm(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafo_lin(Col1,Lin).
cria_grafo_lin(Col,Lin):-Col1 is Col-1,cria_grafo_lin(Col1,Lin).



%Outros algoritmos
dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacel(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).
			
bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacel(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

:-dynamic melhor_sol_dfs/2.
better_dfs1(Orig,Dest,LCaminho_minlig):-
        get_time(Ti),
        (better_dfs11(Orig,Dest);true),
        retract(melhor_sol_dfs(LCaminho_minlig,_)),
        get_time(Tf),
        T is Tf-Ti,
        write('Tempo de geracao da solucao:'),write(T),nl.

better_dfs11(Orig,Dest):-
        asserta(melhor_sol_dfs(_,10000)),
        dfs(Orig,Dest,LCaminho),
        atualiza_melhor_dfs(LCaminho),
        fail.

atualiza_melhor_dfs(LCaminho):-
        melhor_sol_dfs(_,N),
        length(LCaminho,C),
        C<N,retract(melhor_sol_dfs(_,_)),
        asserta(melhor_sol_dfs(LCaminho,C)).


%Cria matriz de 0s a partir da matriz m e chama cria_grafo
:-dynamic ligacel/2.
:-dynamic m/3.
:-dynamic nlin/1.
cria_matriz:-
    retractall(m(_,_,_)),
    retractall(ligacel(_,_)),
    write('Numero de Colunas: '),read(NCol),nl,
    write('Numero de Linhas: '),read(NLin),nl,asserta(nlin(NLin)),
    cria_matriz_0(NCol,NLin),cria_grafo(NCol,NLin),retract(nlin(_)).

cria_matriz_0(1,1):-!,asserta(m(1,1,0)).
cria_matriz_0(NCol,1):-!,asserta(m(NCol,1,0)),NCol1 is NCol-1,nlin(NLin),cria_matriz_0(NCol1,NLin).
cria_matriz_0(NCol,NLin):-asserta(m(NCol,NLin,0)),NLin1 is NLin-1,cria_matriz_0(NCol,NLin1).

/*
Estudo complexidade para matriz m de 0s e 4*4

?- cria_grafo(4,4).
true.

?- cria_matriz.
Numero de Colunas: 4.
Numero de Linhas: 4.

?- dfs(cel(1,1),cel(4,4),Cam).
Cam = [cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(4, 2), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3),cel(2, 3),cel(3, 3),cel(4, 3),cel(4, 4)]

?- bfs(cel(1,1),cel(4,4),Cam).
Cam = [cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(4, 2), cel(4, 3), cel(4, 4)]

?- better_dfs(cel(1,1),cel(4,4),Cam).
Tempo de geracao da solucao (cronometro):0,080s 
Cam = [cel(1, 1), cel(1, 2), cel(1, 3), cel(1, 4), cel(2, 4), cel(3, 4), cel(4, 4)].

?- better_dfs1(cel(1,1),cel(4,4),Cam).
Tempo de geracao da solucao (TSol):0.014s
Cam = [cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(4, 2), cel(4, 3), cel(4, 4)].
*/


/*
Estudo complexidade para matriz m de 0s e 5*5

?- cria_grafo(5,5).
true.

?- cria_matriz.
Numero de Colunas: 5.
Numero de Linhas: 5.

?- dfs(cel(1,1),cel(5,5),Cam).
Cam=[cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(5, 2), cel(4, 2), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3), cel(4, 3), cel(5, 3), cel(5, 4), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4), cel(1, 5), cel(2, 5), cel(3, 5), cel(4, 5), cel(5, 5)]

?- bfs(cel(1,1),cel(5,5),Cam).
Cam=[cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(5, 2), cel(5, 3), cel(5, 4), cel(5, 5)]

?- better_dfs(cel(1,1),cel(5,5),Cam).
Tempo de geracao da solucao (cronometro):2,377s 
Cam=[cel(1, 1), cel(1, 2), cel(1, 3), cel(1, 4), cel(1, 5), cel(2, 5), cel(3, 5), cel(4, 5) ,cel(5, 5)].

?- better_dfs1(cel(1,1),cel(5,5),Cam).
Tempo de geracao da solucao (TSol):0.980s
Cam = [cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(5, 2), cel(5, 3), cel(5, 4), cel(..., ...)].
*/


/*
Estudo complexidade para matriz m de 0s e 6*6

?- cria_grafo(6,6).
true.

?- cria_matriz.
Numero de Colunas: 6.
Numero de Linhas: 6.

?- dfs(cel(1,1),cel(6,6),Cam).
Cam=[cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(6, 1), cel(6, 2), cel(5, 2), cel(4, 2), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3), cel(4, 3), cel(5, 3), cel(6, 3), cel(6, 4), cel(5, 4), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4), cel(1, 5), cel(2, 5), cel(3, 5), cel(4, 5), cel(5, 5), cel(6, 5), cel(6, 6)]

?- bfs(cel(1,1),cel(6,6),Cam).
Cam=[cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(6, 1), cel(6, 2), cel(6, 3), cel(6, 4), cel(6, 5), cel(6, 6)]

?- better_dfs(cel(1,1),cel(6,6),Cam).
ERROR: Out of global stack

?- better_dfs1(cel(1,1),cel(6,6),Cam).
Tempo de geracao da solucao (TSol):362.991s (aprox. 6min).
Cam = [cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(6, 1), cel(6, 2), cel(6, 3), cel(..., ...)|...].

*/


/*
Estudo complexidade para matriz m de 0s e 7*7

?- cria_grafo(7,7).
true.

?- cria_matriz.
Numero de Colunas: 7.
Numero de Linhas: 7.

?- dfs(cel(1,1),cel(7,7),Cam).
Cam = [cel(1, 1), cel(2, 1), cel(3, 1), cel(4, 1), cel(5, 1), cel(6, 1), cel(7, 1), cel(7, 2), cel(..., ...)|...]

?- bfs(cel(1,1),cel(7,7),Cam).
Erro de stack

?- better_dfs(cel(1,1),cel(7,7),Cam).
Erro de stack

?- better_dfs1(cel(1,1),cel(7,7),Cam).
Nao devolveu resultado. Esteve 2,5h a processar.
*/
