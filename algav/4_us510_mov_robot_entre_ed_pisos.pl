%?- consult("cria_grafo.pl").

%EdificioAPiso1(a1)Matriz4*4
%coluna :1,2,3,4
%linha 1:1,1,0,1
%linha 2:1,0,1,P
%linha 3:E,0,0,0
%linha 4:C,0,0,0

%a1(col,lin,valor)  (1,3)
a1(1,1,1).
a1(2,1,1).
a1(3,1,0).
a1(4,1,1).

a1(1,2,1).
a1(2,2,0).
a1(3,2,1).
a1(4,2,0).

a1(1,3,0).
a1(2,3,0).
a1(3,3,0).
a1(4,3,0).

a1(1,4,0).
a1(2,4,0).
a1(3,4,0).
a1(4,4,0).

%EdificioAPiso2(a2)Matriz4*4
%coluna :1,2,3,4
%linha 1:C,0,1,1
%linha 2:C,0,1,P
%linha 3:E,0,0,0
%linha 4:C,0,0,0

%a2(col,lin,valor)
a2(1,1,0).
a2(2,1,0).
a2(3,1,1).
a2(4,1,1).

a2(1,2,0).
a2(2,2,0).
a2(3,2,1).
a2(4,2,0).

a2(1,3,0).
a2(2,3,0).
a2(3,3,0).
a2(4,3,0).

a2(1,4,0).
a2(2,4,0).
a2(3,4,0).
a2(4,4,0).


%EdificioDPiso2(d2)Matriz4*4
%coluna :1,2,3,4
%linha 1:E,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:C,0,0,0

%d2(col,lin,valor)
d2(1,1,0).
d2(2,1,0).
d2(3,1,0).
d2(4,1,1).

d2(1,2,0).
d2(2,2,0).
d2(3,2,1).
d2(4,2,0).

d2(1,3,0).
d2(2,3,0).
d2(3,3,0).
d2(4,3,0).

d2(1,4,0).
d2(2,4,0).
d2(3,4,0).
d2(4,4,0).



%EdificioDPiso1(d1)Matriz4*4
%coluna :1,2,3,4
%linha 1:E,1,0,1
%linha 2:C,0,0,P
%linha 3:C,0,0,1
%linha 4:C,0,0,0

%d1(col,lin,valor)
d1(1,1,0).
d1(2,1,1).
d1(3,1,0).
d1(4,1,1).

d1(1,2,0).
d1(2,2,0).
d1(3,2,0).
d1(4,2,0).

d1(1,3,0).
d1(2,3,0).
d1(3,3,0).
d1(4,3,1).

d1(1,4,0).
d1(2,4,1).
d1(3,4,1).
d1(4,4,1).



%EdificioDPiso3(d3)Matriz4*4
%coluna :1,2,3,4
%linha 1:E,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:C,0,0,0

%d3(col,lin,valor)
d3(1,1,0).
d3(2,1,0).
d3(3,1,0).
d3(4,1,1).

d3(1,2,0).
d3(2,2,0).
d3(3,2,1).
d3(4,2,0).

d3(1,3,0).
d3(2,3,0).
d3(3,3,0).
d3(4,3,0).

d3(1,4,0).
d3(2,4,0).
d3(3,4,0).
d3(4,4,0).


%EdificioCPiso1(c1)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:E,0,0,0

%c1(col,lin,valor)
c1(1,1,0).
c1(2,1,0).
c1(3,1,0).
c1(4,1,1).

c1(1,2,0).
c1(2,2,0).
c1(3,2,1).
c1(4,2,0).

c1(1,3,0).
c1(2,3,0).
c1(3,3,0).
c1(4,3,0).

c1(1,4,0).
c1(2,4,0).
c1(3,4,0).
c1(4,4,0).

%EdificioCPiso1(c2)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:E,0,0,0

%c2(col,lin,valor)
c2(1,1,0).
c2(2,1,0).
c2(3,1,0).
c2(4,1,1).

c2(1,2,0).
c2(2,2,0).
c2(3,2,1).
c2(4,2,0).

c2(1,3,0).
c2(2,3,0).
c2(3,3,0).
c2(4,3,0).

c2(1,4,0).
c2(2,4,1).
c2(3,4,0).
c2(4,4,0).


%EdificioCPiso3(c3)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:E,0,0,0

%c3(col,lin,valor)
c3(1,1,0).
c3(2,1,0).
c3(3,1,0).
c3(4,1,1).

c3(1,2,0).
c3(2,2,0).
c3(3,2,1).
c3(4,2,0).

c3(1,3,0).
c3(2,3,0).
c3(3,3,0).
c3(4,3,0).

c3(1,4,0).
c3(2,4,0).
c3(3,4,0).
c3(4,4,0).


%EdificioCPiso4(c4)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:E,0,0,0

%c4(col,lin,valor)
c4(1,1,0).
c4(2,1,0).
c4(3,1,0).
c4(4,1,1).

c4(1,2,0).
c4(2,2,0).
c4(3,2,1).
c4(4,2,0).

c4(1,3,0).
c4(2,3,0).
c4(3,3,0).
c4(4,3,0).

c4(1,4,0).
c4(2,4,0).
c4(3,4,0).
c4(4,4,0).


%EdificioBPiso1(b1)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:0,0,0,E

%b1(col,lin,valor)
b1(1,1,0).
b1(2,1,0).
b1(3,1,0).
b1(4,1,0).

b1(1,2,0).
b1(2,2,0).
b1(3,2,1).
b1(4,2,0).

b1(1,3,0).
b1(2,3,0).
b1(3,3,0).
b1(4,3,0).

b1(1,4,0).
b1(2,4,0).
b1(3,4,0).
b1(4,4,0).

%EdificioBPiso2(b2)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:0,0,0,E

%b2(col,lin,valor)
b2(1,1,0).
b2(2,1,0).
b2(3,1,0).
b2(4,1,0).

b2(1,2,0).
b2(2,2,0).
b2(3,2,1).
b2(4,2,0).

b2(1,3,0).
b2(2,3,0).
b2(3,3,0).
b2(4,3,0).

b2(1,4,0).
b2(2,4,0).
b2(3,4,0).
b2(4,4,0).

%EdificioBPiso3(b3)Matriz4*4
%coluna :1,2,3,4
%linha 1:0,0,1,1
%linha 2:C,0,1,P
%linha 3:C,0,0,0
%linha 4:0,0,0,E

%b3(col,lin,valor)
b3(1,1,0).
b3(2,1,0).
b3(3,1,0).
b3(4,1,0).

b3(1,2,0).
b3(2,2,0).
b3(3,2,1).
b3(4,2,0).

b3(1,3,0).
b3(2,3,0).
b3(3,3,0).
b3(4,3,0).

b3(1,4,0).
b3(2,4,0).
b3(3,4,0).
b3(4,4,0).


 
% Definindo dinamicamente o predicado ligacel para poder adicionar conexões
:- dynamic ligacel/2.

% Inicia a criação do grafo
cria_grafo :- 
    cria_grafo(4, 4).

% Caso base: quando Lin é 0, apenas cria a conexão específica
cria_grafo(_, 0) :- 
    estabelece_conexao, !.


% Caso recursivo: cria as ligações para uma linha e depois passa para a anterior
cria_grafo(Col, Lin) :-
    cria_grafo_lin(Col, Lin),
    Lin1 is Lin - 1,
    cria_grafo(Col, Lin1).


% Cria as conexões para uma linha específica
cria_grafo_lin(0, _) :- !.
cria_grafo_lin(Col, Lin) :-
    conecta_celulas(Col, Lin),
    Col1 is Col - 1,
    cria_grafo_lin(Col1, Lin).
  %    cria_grafo_lin(Col,Lin):-Col1 is Col-1,cria_grafo_lin(Col1,Lin).

% Conecta uma célula com suas adjacentes na mesma matriz
conecta_celulas(Col, Lin) :-
     (a2(Col, Lin, 0); a1(Col, Lin, 0); 
     d1(Col, Lin, 0); d2(Col, Lin, 0); d3(Col, Lin, 0);
     c1(Col, Lin, 0); c2(Col, Lin, 0); c3(Col, Lin, 0); c4(Col, Lin, 0),
     b1(Col, Lin, 0); b2(Col, Lin, 0); b3(Col, Lin, 0)),

    conecta_adjacentes(Col, Lin, a1),
    conecta_adjacentes(Col, Lin, a2),
    conecta_adjacentes(Col, Lin, d1),
    conecta_adjacentes(Col, Lin, d2),
    conecta_adjacentes(Col, Lin, d3),
    conecta_adjacentes(Col, Lin, c1),
    conecta_adjacentes(Col, Lin, c2),
    conecta_adjacentes(Col, Lin, c3),
    conecta_adjacentes(Col, Lin, c4),
    conecta_adjacentes(Col, Lin, b1),
     conecta_adjacentes(Col, Lin, b2),
     conecta_adjacentes(Col, Lin, b3).

% Conecta uma célula com as adjacentes na mesma matriz
conecta_adjacentes(Col, Lin, Matriz) :-
    ColS is Col + 1, ColA is Col - 1, LinS is Lin + 1, LinA is Lin - 1,
    (call(Matriz, ColS, Lin, 0), assertz(ligacel(cel(Matriz, Col, Lin), cel(Matriz, ColS, Lin))); true),
    (call(Matriz, ColA, Lin, 0), assertz(ligacel(cel(Matriz, Col, Lin), cel(Matriz, ColA, Lin))); true),
    (call(Matriz, Col, LinS, 0), assertz(ligacel(cel(Matriz, Col, Lin), cel(Matriz, Col, LinS))); true),
    (call(Matriz, Col, LinA, 0), assertz(ligacel(cel(Matriz, Col, Lin), cel(Matriz, Col, LinA))); true),

  ((call(Matriz,ColS, LinS, 0), call(Matriz,ColS, Lin, 0), call(Matriz,Col, LinS, 0), assertz(ligacel(cel(Matriz, Col, Lin), cel(Matriz,ColS, LinS)));true)),
    ((call(Matriz,ColA, LinS, 0), call(Matriz,ColA, Lin, 0), call(Matriz,Col, LinS, 0), assertz(ligacel(cel(Matriz,Col, Lin), cel(Matriz,ColA, LinS)));true)),
    ((call(Matriz,ColS, LinA, 0), call(Matriz,ColS, Lin, 0), call(Matriz,Col, LinA, 0), assertz(ligacel(cel(Matriz,Col, Lin), cel(Matriz,ColS, LinA)));true)),
    ((call(Matriz,ColA, LinA, 0), call(Matriz,ColA, Lin, 0), call(Matriz,Col, LinA, 0), assertz(ligacel(cel(Matriz,Col, Lin), cel(Matriz,ColA, LinA)));true)).
   





% Estabelece a conexão específica célula


estabelece_conexao :-

%ELEVADORES
    assertz(ligacel(cel(a1, 1, 3), cel(a2, 1, 3))),
      assertz(ligacel(cel(a2, 1, 3), cel(a1, 1, 3))),
    assertz(ligacel(cel(d1, 1, 1), cel(d2, 1, 1))),
    assertz(ligacel(cel(d1, 1, 1), cel(d3, 1, 1))),
    assertz(ligacel(cel(d2, 1, 1), cel(d1, 1, 1))),
    assertz(ligacel(cel(d2, 1, 1), cel(d3, 1, 1))),
    assertz(ligacel(cel(d3, 1, 1), cel(d1, 1, 1))),
    assertz(ligacel(cel(d3, 1, 1), cel(d2, 1, 1))),
     assertz(ligacel(cel(c1, 1, 4), cel(c2, 1, 4))),
     assertz(ligacel(cel(c1, 1, 4), cel(c3, 1, 4))),
     assertz(ligacel(cel(c1, 1, 4), cel(c4, 1, 4))),
 assertz(ligacel(cel(c2, 1, 4), cel(c1, 1, 4))), 
     assertz(ligacel(cel(c2, 1, 4), cel(c3, 1, 4))),
     assertz(ligacel(cel(c2, 1, 4), cel(c4, 1, 4))),
     assertz(ligacel(cel(c3, 1, 4), cel(c1, 1, 4))),
     assertz(ligacel(cel(c3, 1, 4), cel(c2, 1, 4))),
     assertz(ligacel(cel(c3, 1, 4), cel(c4, 1, 4))),
     assertz(ligacel(cel(c4, 1, 4), cel(c1, 1, 4))),
     assertz(ligacel(cel(c4, 1, 4), cel(c2, 1, 4))),
     assertz(ligacel(cel(c4, 1, 4), cel(c3, 1, 4))),

      assertz(ligacel(cel(b1, 4,4 ), cel(b2, 4, 4))),
       assertz(ligacel(cel(b1, 4,4 ), cel(b3, 4, 4))),
       assertz(ligacel(cel(b2, 4, 4), cel(b1, 4, 4))),
        assertz(ligacel(cel(b2, 4,4 ), cel(b3, 4, 4))),
        assertz(ligacel(cel(b3, 4,4 ), cel(b1, 4, 4))),
        assertz(ligacel(cel(b3, 4,4 ), cel(b2, 4, 4))), 

        %PASSAGENS
        assertz(ligacel(cel(d2, 3, 2), cel(c2, 2, 4))),
    assertz(ligacel(cel(c2, 2, 4), cel(d2, 3, 2))),
    assertz(ligacel(cel(a2, 4, 2), cel(b2, 4,2))),
    assertz(ligacel(cel(b2, 4, 2), cel(a2, 4,2))),
    assertz(ligacel(cel(b2, 4, 2), cel(c3, 4,2))),
    assertz(ligacel(cel(c3, 4, 2), cel(b2, 4,2))),
    assertz(ligacel(cel(b2, 4, 2), cel(d3, 4,2))),
    assertz(ligacel(cel(d3, 4, 2), cel(b2, 4,2))),
    assertz(ligacel(cel(d3, 4, 2), cel(c3, 4,2))),
    assertz(ligacel(cel(c3, 4, 2), cel(d3, 4,2))),
    assertz(ligacel(cel(b3, 4, 2), cel(c4, 4,2))),
    assertz(ligacel(cel(c4, 4, 2), cel(b3, 4,2))).


% Predicado para consultar e imprimir ligações entre células
consultar_ligacoes :-
    ligacel(A, B),
    write('Conexão entre: '), write(A), write(' e '), write(B), nl,
    fail. % Para continuar procurando ligações

% Quando todas as ligações forem impressas, o programa termina
consultar_ligacoes :- 
    write('Fim das conexões.'), nl.






% Inicia a pesquisa DFS
dfs(Orig, Dest, Caminho):-
    write('Iniciando DFS de '), write(Orig), write(' para '), write(Dest), nl,
    dfs2(Orig, Dest, [Orig], Caminho),
    write('DFS finalizado.'), nl.

% Caso base: destino alcançado
dfs2(Dest, Dest, LA, Caminho):-
    reverse(LA, Caminho),
    write('Caminho encontrado: '), write(Caminho), nl.

% Caso recursivo: explorar conexões
dfs2(Orig, Dest, LA, Caminho):-
    ligacel(Orig, Prox),
    \+ member(Prox, LA),
    write('Visitando: '), write(Orig), write(', movendo para: '), write(Prox), nl,
    dfs2(Prox, Dest, [Prox|LA], Caminho).



/*
dfs(cel(a1, 4, 3), cel(b2, 3, 3),L).
Caminho encontrado: [cel(a1,4,3),cel(a1,3,3),cel(a1,2,3),cel(a1,1,3),cel(a2,1,3),cel(a2,2,3),cel(a2,3,3),cel(a2,4,3),cel(a2,4,2),cel(b2,4,2),cel(b2,3,2),cel(b2,2,2),cel(b2,1,2),cel(b2,1,3),cel(b2,2,3),cel(b2,3,3)]
DFS finalizado.
L = [cel(a1, 4, 3), cel(a1, 3, 3), cel(a1, 2, 3), cel(a1, 1, 3), cel(a2, 1, 3), cel(a2, 2, 3), cel(a2, 3, 3), cel(a2, 4, 3), cel(..., ..., ...)|...] .
*/

 /*dfs(cel(a2, 4, 3), cel(b2, 3, 3),L).
 Iniciando DFS de cel(a2,4,3) para cel(b2,3,3)
Visitando: cel(a2,4,3), movendo para: cel(a2,3,3)
Visitando: cel(a2,3,3), movendo para: cel(a2,2,3)
Visitando: cel(a2,2,3), movendo para: cel(a2,1,3)
Visitando: cel(a2,1,3), movendo para: cel(a2,1,4)
Visitando: cel(a2,1,4), movendo para: cel(a2,2,4)
Visitando: cel(a2,2,4), movendo para: cel(a2,3,4)
Visitando: cel(a2,3,4), movendo para: cel(a2,4,4)
Visitando: cel(a2,1,3), movendo para: cel(a2,1,2)
Visitando: cel(a2,1,2), movendo para: cel(a2,2,2)
Visitando: cel(a2,2,2), movendo para: cel(a2,3,2)
Visitando: cel(a2,3,2), movendo para: cel(a2,4,2)
Visitando: cel(a2,4,2), movendo para: cel(a2,4,1)
Visitando: cel(a2,4,1), movendo para: cel(a2,3,1)
Visitando: cel(a2,3,1), movendo para: cel(a2,2,1)
Visitando: cel(a2,2,1), movendo para: cel(a2,1,1)
Visitando: cel(a2,4,2), movendo para: cel(a2,3,1)
Visitando: cel(a2,3,1), movendo para: cel(a2,4,1)
Visitando: cel(a2,3,1), movendo para: cel(a2,2,1)
Visitando: cel(a2,2,1), movendo para: cel(a2,1,1)
Visitando: cel(a2,4,2), movendo para: cel(b2,4,2)
Visitando: cel(b2,4,2), movendo para: cel(b2,3,2)
Visitando: cel(b2,3,2), movendo para: cel(b2,2,2)
Visitando: cel(b2,2,2), movendo para: cel(b2,1,2)
Visitando: cel(b2,1,2), movendo para: cel(b2,1,3)
Visitando: cel(b2,1,3), movendo para: cel(b2,2,3)
Visitando: cel(b2,2,3), movendo para: cel(b2,3,3)
Caminho encontrado: [cel(a2,4,3),cel(a2,3,3),cel(a2,2,3),cel(a2,1,3),cel(a2,1,2),cel(a2,2,2),cel(a2,3,2),cel(a2,4,2),cel(b2,4,2),cel(b2,3,2),cel(b2,2,2),cel(b2,1,2),cel(b2,1,3),cel(b2,2,3),cel(b2,3,3)]
DFS finalizado.
L = [cel(a2, 4, 3), cel(a2, 3, 3), cel(a2, 2, 3), cel(a2, 1, 3), cel(a2, 1, 2), cel(a2, 2, 2), cel(a2, 3, 2), cel(a2, 4, 2), cel(..., ..., ...)|...] 


/*
?- dfs(cel(c2, 4, 3), cel(c1, 3, 3),L).
Iniciando DFS de cel(c2,4,3) para cel(c1,3,3)
Visitando: cel(c2,4,3), movendo para: cel(c2,3,3)
Visitando: cel(c2,3,3), movendo para: cel(c2,2,3)
Visitando: cel(c2,2,3), movendo para: cel(c2,1,3)
Visitando: cel(c2,1,3), movendo para: cel(c2,1,4)
Visitando: cel(c2,1,4), movendo para: cel(c1,1,4)
Visitando: cel(c1,1,4), movendo para: cel(c1,2,4)
Visitando: cel(c1,2,4), movendo para: cel(c1,3,4)
Visitando: cel(c1,3,4), movendo para: cel(c1,4,4)
Visitando: cel(c1,4,4), movendo para: cel(c1,4,3)
Visitando: cel(c1,4,3), movendo para: cel(c1,3,3)
Caminho encontrado: [cel(c2,4,3),cel(c2,3,3),cel(c2,2,3),cel(c2,1,3),cel(c2,1,4),cel(c1,1,4),cel(c1,2,4),cel(c1,3,4),cel(c1,4,4),cel(c1,4,3),cel(c1,3,3)]
DFS finalizado.
L = [cel(c2, 4, 3),

*/




%?- dfs_conectado(cel(i2, 4, 3), cel(i3, 3, 3),L).
%(..., ...)


all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

%?- all_dfs(cel(4,1),cel(4,4),L),length(L,Length).


better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

%?- better_dfs(cel(1,1),cel(4,4),L).
%L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(1, 4), cel(2, 4), cel(3, 4), cel(4, 4)].
 

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


%Permite identificar a ou as soluções com o menor numero de elementos.
%?- bfs(cel(1,1),cel(4,4),L).
%L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(4, 4)] ;
%(..., ...)


better_dfs1(Orig,Dest,LCaminho_minlig):-
                                            get_time(Ti),
                                            (better_dfs11(Orig,Dest);true),
                                            retract(ligacel(LCaminho_minlig,_)),
                                            get_time(Tf),
                                            T is Tf-Ti,
                                            write('Tempo de geracao da solucao:'),write(T),nl.
better_dfs11(Orig,Dest):-
                            asserta(ligacel(_,10000)),
                            dfs(Orig,Dest,LCaminho),
                            atualiza_melhor_dfs(LCaminho),
                            fail.
atualiza_melhor_dfs(LCaminho):-
                            ligacel(_,N),
                            length(LCaminho,C),
                            C<N,retract(ligacel(_,_)),
                            asserta(ligacel(LCaminho,C)).