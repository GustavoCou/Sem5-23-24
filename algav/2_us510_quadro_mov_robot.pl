%?- consult("2_us510_quadro_mov_robot.pl").


%BASE DE CONHECIMENTO

%:-dynamic ligaceli1/2.
%EdificioIPiso1(i1)Matriz4*4
%coluna :1,2,3,4
%linha 1:1,1,P,0
%linha 2:1,1,1,0
%linha 3:E,0,0,0
%linha 4:0,0,0,0

%i1(col,lin,valor)  
i1(1,1,1).
i1(2,1,1).
i1(3,1,0).
i1(4,1,0).

i1(1,2,1).
i1(2,2,1).
i1(3,2,1).
i1(4,2,0).

i1(1,3,0).
i1(2,3,0).
i1(3,3,0).
i1(4,3,0).

i1(1,4,0).
i1(2,4,0).
i1(3,4,0).
i1(4,4,0).

%Cria grafo considerando a matriz i1
:-dynamic ligaceli1/2.

cria_grafoi1(_,0):-!.
cria_grafoi1(Col,Lin):-cria_grafoi1_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoi1(Col,Lin1).

cria_grafoi1_lin(0,_):-!.
cria_grafoi1_lin(Col,Lin):-i1(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((i1(ColS,Lin,0),assertz(ligaceli1(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((i1(ColA,Lin,0),assertz(ligaceli1(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((i1(Col,LinS,0),assertz(ligaceli1(cel(Col,Lin),cel(Col,LinS)));true)),
    ((i1(Col,LinA,0),assertz(ligaceli1(cel(Col,Lin),cel(Col,LinA)));true)),

	    % Ligações nas diagonais 

    ((i1(ColS, LinS, 0), i1(ColS, Lin, 0), i1(Col, LinS, 0), assertz(ligaceli1(cel(Col, Lin), cel(ColS, LinS)));true)),
    ((i1(ColA, LinS, 0), i1(ColA, Lin, 0), i1(Col, LinS, 0), assertz(ligaceli1(cel(Col, Lin), cel(ColA, LinS)));true)),
    ((i1(ColS, LinA, 0), i1(ColS, Lin, 0), i1(Col, LinA, 0), assertz(ligaceli1(cel(Col, Lin), cel(ColS, LinA)));true)),
    ((i1(ColA, LinA, 0), i1(ColA, Lin, 0), i1(Col, LinA, 0), assertz(ligaceli1(cel(Col, Lin), cel(ColA, LinA)));true)),
    
    Col1 is Col-1,
    cria_grafoi1_lin(Col1,Lin).
cria_grafoi1_lin(Col,Lin):-Col1 is Col-1,cria_grafoi1_lin(Col1,Lin).


%?- cria_grafoi1(4,4).
%true.

/*
?- ligaceli1(A,B).
A = cel(4, 4),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(4, 3) ;
A = cel(3, 4),
B = cel(4, 4) ;
A = cel(3, 4),
B = cel(2, 4) ;
A = cel(3, 4),
B = cel(3, 3) ;
A = cel(2, 4),
B = cel(3, 4) ;
A = cel(2, 4),
B = cel(1, 4) ;
A = cel(2, 4),
B = cel(2, 3) ;
A = cel(1, 4),
B = cel(2, 4) ;
(...)
*/

/*
?- findall(_,ligaceli1(_,_),L),length(L,Length).
L = [_2062, _2056, _2050, _2044, _2038, _2032, _2026, _2020, _2014|...],
Length = 26.
*/


dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligaceli1(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(4,1),cel(1,4),L).
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4)] ;
*/


all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(4,1),cel(1,4),L),length(L,Length).
L = [[cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)], [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(2, 4), cel(..., ...)], 
[cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...], [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(..., ...)|...], [cel(4, 1), cel(4, 2), 
cel(4, 3), cel(..., ...)|...], [cel(4, 1), cel(4, 2), cel(..., ...)|...], [cel(4, 1), cel(..., ...)|...], [cel(..., ...)|...]],
Length = 8.
*/


better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(4,1),cel(1,4),L).
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligaceli1(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).


/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(4,1),cel(1,4),L).
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 1), cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4)] ;
*/




%:-dynamic ligaceli2/2.
%EdificioIPiso2(i2)Matriz4*4
%coluna :1,2,3,4
%linha 1:1,1,1,1
%linha 2:1,1,1,P
%linha 3:E,0,0,0
%linha 4:C,0,0,0

%i2(col,lin,valor)
i2(1,1,1).
i2(2,1,1).
i2(3,1,1).
i2(4,1,1).

i2(1,2,1).
i2(2,2,1).
i2(3,2,1).
i2(4,2,0).

i2(1,3,0).
i2(2,3,0).
i2(3,3,0).
i2(4,3,0).

i2(1,4,0).
i2(2,4,0).
i2(3,4,0).
i2(4,4,0).

%Cria grafo para o piso ligaceli2/2 com a matriz 4*4 i2 definida mais acima
:-dynamic ligaceli2/2.

cria_grafoi2(_,0):-!.
cria_grafoi2(Col,Lin):-cria_grafoi2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoi2(Col,Lin1).

cria_grafoi2_lin(0,_):-!.
cria_grafoi2_lin(Col,Lin):-i2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((i2(ColS,Lin,0),assertz(ligaceli2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((i2(ColA,Lin,0),assertz(ligaceli2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((i2(Col,LinS,0),assertz(ligaceli2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((i2(Col,LinA,0),assertz(ligaceli2(cel(Col,Lin),cel(Col,LinA)));true)),
    
	%ALTERAÇOES FEITAS -> ACRECENTAR I2 AO LIGACEL
((i2(ColS, LinS, 0), i2(ColS, Lin, 0), i2(Col, LinS, 0), assertz(ligaceli2(cel(Col, Lin), cel(ColS, LinS)));true)),
((i2(ColA, LinS, 0), i2(ColA, Lin, 0), i2(Col, LinS, 0), assertz(ligaceli2(cel(Col, Lin), cel(ColA, LinS)));true)),
((i2(ColS, LinA, 0), i2(ColS, Lin, 0), i2(Col, LinA, 0), assertz(ligaceli2(cel(Col, Lin), cel(ColS, LinA)));true)),
((i2(ColA, LinA, 0), i2(ColA, Lin, 0), i2(Col, LinA, 0), assertz(ligaceli2(cel(Col, Lin), cel(ColA, LinA)));true)),
	
	
	Col1 is Col-1,
    cria_grafoi2_lin(Col1,Lin).
cria_grafoi2_lin(Col,Lin):-Col1 is Col-1,cria_grafoi2_lin(Col1,Lin).


%?- cria_grafoi2(4,4).
%true.

/*
?- ligaceli2(A,B).
A = cel(4, 4),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(4, 3) ;
A = cel(3, 4),
B = cel(4, 4) ;
A = cel(3, 4),
B = cel(2, 4) ;
A = cel(3, 4),
B = cel(3, 3) ;
A = cel(2, 4),
B = cel(3, 4) ;
A = cel(2, 4),
B = cel(1, 4) ;
A = cel(2, 4),
B = cel(2, 3) ;
A = cel(1, 4),
B = cel(2, 4) ;
(...)
*/

/*
?- findall(_,ligaceli2(_,_),L),length(L,Length).
L = [_3262, _3256, _3250, _3244, _3238, _3232, _3226, _3220, _3214|...],
Length = 22.
*/


dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligaceli2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(4,2),cel(1,4),L).
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(2, 4), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(3, 3), cel(2, 3), cel(2, 4), cel(1, 4)] ;
*/

%************************REBENTA A STACK*********
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(4,2),cel(1,4),L),length(L,Length).
L = [[cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)], [cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(2, 4), cel(1, 4)], [cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(2, 4), cel(..., ...)], [cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...], [cel(4, 2), cel(4, 3), cel(4, 4), cel(..., ...)|...], [cel(4, 2), cel(4, 3), cel(..., ...)|...], [cel(4, 2), cel(..., ...)|...], [cel(..., ...)|...]],
Length = 8.
*/

%***REBENTA A STACK*****************+
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(4,2),cel(1,4),L).
L = [cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4)].
*/


bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligaceli2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(4,2),cel(1,4),L).
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(1, 3), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(2, 3), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(2, 4), cel(1, 4)] ;
L = [cel(4, 2), cel(4, 3), cel(4, 4), cel(3, 4), cel(2, 4), cel(1, 4)] ;
*/




%:-dynamic ligaceli3/2.
%EdificioIPiso3(i3)Matriz4*4
%coluna :1,2,3,4
%linha 1:C,0,1,1
%linha 2:C,0,1,P
%linha 3:E,0,0,0
%linha 4:C,0,0,0

%i3(col,lin,valor)
i3(1,1,0).
i3(2,1,0).
i3(3,1,1).
i3(4,1,1).

i3(1,2,0).
i3(2,2,0).
i3(3,2,1).
i3(4,2,0).

i3(1,3,0).
i3(2,3,0).
i3(3,3,0).
i3(4,3,0).

i3(1,4,0).
i3(2,4,0).
i3(3,4,0).
i3(4,4,0).

%Cria grafo para o piso ligaceli3/2 com a matriz 4*4 i3 definida mais acima
:-dynamic ligaceli3/2.

cria_grafoi3(_,0):-!.
cria_grafoi3(Col,Lin):-cria_grafoi3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoi3(Col,Lin1).

cria_grafoi3_lin(0,_):-!.
cria_grafoi3_lin(Col,Lin):-i3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((i3(ColS,Lin,0),assertz(ligaceli3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((i3(ColA,Lin,0),assertz(ligaceli3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((i3(Col,LinS,0),assertz(ligaceli3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((i3(Col,LinA,0),assertz(ligaceli3(cel(Col,Lin),cel(Col,LinA)));true)),

	%ACRESCENTADO I3 ao liga cell
	((i3(ColS, LinS, 0), i3(ColS, Lin, 0), i3(Col, LinS, 0), assertz(ligaceli3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((i3(ColA, LinS, 0), i3(ColA, Lin, 0), i3(Col, LinS, 0), assertz(ligaceli3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((i3(ColS, LinA, 0), i3(ColS, Lin, 0), i3(Col, LinA, 0), assertz(ligaceli3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((i3(ColA, LinA, 0), i3(ColA, Lin, 0), i3(Col, LinA, 0), assertz(ligaceli3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafoi3_lin(Col1,Lin).
cria_grafoi3_lin(Col,Lin):-Col1 is Col-1,cria_grafoi3_lin(Col1,Lin).

%?- cria_grafoi3(4,4).
%true.

/*?- ligaceli3(A,B).
A = cel(4, 4),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(4, 3) ;
A = cel(3, 4),
B = cel(4, 4) ;
A = cel(3, 4),
B = cel(2, 4) ;
A = cel(3, 4),
B = cel(3, 3) ;
A = cel(2, 4),
B = cel(3, 4) ;
A = cel(2, 4),
B = cel(2, 3) ;
A = cel(1, 4),
B = cel(2, 4) ;
A = cel(1, 4),
B = cel(1, 3) ;
(...)*/

/*?- findall(_,ligaceli3(_,_),L),length(L,Length).
L = [_2110, _2104, _2098, _2092, _2086, _2080, _2074, _2068, _2062|...],
Length = 34.
Há 34 ligações (ligaceli3/2) que foram criadas*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligaceli3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

%?- dfs(cel(1,1),cel(4,4),L).
%Cam = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3), cel(4, 3), cel(4, 4)]
%(..., ...)

%********************REBENTA A STACK*************+

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

%?- all_dfs(cel(1,1),cel(4,4),L),length(L,Length).
%L = [[cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), 
%cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(..., ...)|...], [cel(1, 1), 
%cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
%Length = 28.


%******************************REBENTA A STACK**********+
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
		(Dest\==Act,ligaceli3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).


%Permite identificar a ou as soluções com o menor numero de elementos.
%?- bfs(cel(1,1),cel(4,4),L).
%L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(4, 4)] ;
%(..., ...)




%:-dynamic ligacelb1/2.
%EdificioBPiso1(b1)Matriz5*5
%coluna :1,2,3,4,5
%linha 1:1,1,1,1,1
%linha 2:1,1,0,0,1
%linha 3:1,1,0,0,1
%linha 4:1,P,0,0,E
%linha 5:1,1,1,1,1

%b1(col,lin,valor) 
b1(1,1,1).
b1(2,1,1).
b1(3,1,1).
b1(4,1,1).
b1(5,1,1).

b1(1,2,1).
b1(2,2,1).
b1(3,2,0).
b1(4,2,0).
b1(5,2,1).

b1(1,3,1).
b1(2,3,1).
b1(3,3,0).
b1(4,3,0).
b1(5,3,1).

b1(1,4,1).
b1(2,4,0).
b1(3,4,0).
b1(4,4,0).
b1(5,4,0).

b1(1,5,1).
b1(2,5,1).
b1(3,5,1).
b1(4,5,1).
b1(5,5,1).

%Cria grafo para o piso ligacelb1/2 com a matriz 5*5 b1 definida mais acima
:-dynamic ligacelb1/2.

cria_grafob1(_,0):-!.
cria_grafob1(Col,Lin):-cria_grafob1_lin(Col,Lin),Lin1 is Lin-
1,cria_grafob1(Col,Lin1).

cria_grafob1_lin(0,_):-!.
cria_grafob1_lin(Col,Lin):-b1(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((b1(ColS,Lin,0),assertz(ligacelb1(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((b1(ColA,Lin,0),assertz(ligacelb1(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((b1(Col,LinS,0),assertz(ligacelb1(cel(Col,Lin),cel(Col,LinS)));true)),
    ((b1(Col,LinA,0),assertz(ligacelb1(cel(Col,Lin),cel(Col,LinA)));true)),
	((b1(ColS, LinS, 0), b1(ColS, Lin, 0), b1(Col, LinS, 0), assertz(ligacelb1(cel(Col, Lin), cel(ColS, LinS)));true)),
	((b1(ColA, LinS, 0), b1(ColA, Lin, 0), b1(Col, LinS, 0), assertz(ligacelb1(cel(Col, Lin), cel(ColA, LinS)));true)),
	((b1(ColS, LinA, 0), b1(ColS, Lin, 0), b1(Col, LinA, 0), assertz(ligacelb1(cel(Col, Lin), cel(ColS, LinA)));true)),
	((b1(ColA, LinA, 0), b1(ColA, Lin, 0), b1(Col, LinA, 0), assertz(ligacelb1(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafob1_lin(Col1,Lin).
cria_grafob1_lin(Col,Lin):-Col1 is Col-1,cria_grafob1_lin(Col1,Lin).

%?- cria_grafob1(5,5).
%true.

/*
?- ligacelb1(A,B).
A = cel(4, 4),
B = cel(5, 4) ;
A = cel(4, 4),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(4, 3) ;
A = cel(3, 4),
B = cel(4, 4) ;
A = cel(3, 4),
B = cel(2, 4) ;
A = cel(3, 4),
B = cel(3, 3) ;
A = cel(2, 4),
B = cel(3, 4) ;
A = cel(4, 3),
B = cel(3, 3) ;
A = cel(4, 3),
B = cel(4, 4) ;
(...)
*/

/*
?- findall(_,ligacelb1(_,_),L),length(L,Length).
L = [_5926, _5920, _5914, _5908, _5902, _5896, _5890, _5884, _5878|...],
Length = 17.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelb1(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(3,2),cel(5,4),L).
L = [cel(3, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(5, 4)] ;
L = [cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(5, 4)] ;
L = [cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(5, 4)] ;
(..., ...)
*/

%***************REBENTA A STACK**********+
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(3,2),cel(5,4),L),length(L,Length).
L = [[cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(4, 4), cel(5, 4)], [cel(3, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(5, 4)], [cel(3, 2), cel(3, 3), cel(4, 3), 
cel(4, 4), cel(5, 4)], [cel(3, 2), cel(3, 3), cel(3,4), cel(4, 4), cel(..., ...)]],
Length = 4.
*/

%*********** REBENTA A STACK **********************

better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(3,2),cel(5,4),L).
L = [cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(5, 4)].
*/

%****REBENTA A STACK*******

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelb1(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(3,2),cel(5,4),L).
L = [cel(3, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(5, 4)] ;
L = [cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(5, 4)] ;
L = [cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(5, 4)] ;
(..., ...)
*/




%:-dynamic ligacelb2/2.
%EdificioBPiso2(b2)Matriz5*5
%coluna :1,2,3,4,5
%linha 1:1,0,0,0,0
%linha 2:C,0,1,1,1
%linha 3:C,0,0,0,1
%linha 4:1,P,0,0,E
%linha 5:1,1,0,0,1

%b2(col,lin,valor)
b2(1,1,1).
b2(2,1,0).
b2(3,1,0).
b2(4,1,0).
b2(5,1,0).

b2(1,2,0).
b2(2,2,0).
b2(3,2,1).
b2(4,2,1).
b2(5,2,1).

b2(1,3,0).
b2(2,3,0).
b2(3,3,0).
b2(4,3,0).
b2(5,3,1).

b2(1,4,1).
b2(2,4,0).
b2(3,4,0).
b2(4,4,0).
b2(5,4,0).

b2(1,5,1).
b2(2,5,1).
b2(3,5,0).
b2(4,5,0).
b2(5,5,1).


%Cria grafo para o piso ligacelb2/2 com a matriz 5*5 b2 definida mais acima
:-dynamic ligacelb2/2.

cria_grafob2(_,0):-!.
cria_grafob2(Col,Lin):-cria_grafob2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafob2(Col,Lin1).

cria_grafob2_lin(0,_):-!.
cria_grafob2_lin(Col,Lin):-b2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((b2(ColS,Lin,0),assertz(ligacelb2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((b2(ColA,Lin,0),assertz(ligacelb2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((b2(Col,LinS,0),assertz(ligacelb2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((b2(Col,LinA,0),assertz(ligacelb2(cel(Col,Lin),cel(Col,LinA)));true)),
	((b2(ColS, LinS, 0), b2(ColS, Lin, 0), b2(Col, LinS, 0), assertz(ligacelb2(cel(Col, Lin), cel(ColS, LinS)));true)),
	((b2(ColA, LinS, 0), b2(ColA, Lin, 0), b2(Col, LinS, 0), assertz(ligacelb2(cel(Col, Lin), cel(ColA, LinS)));true)),
	((b2(ColS, LinA, 0), b2(ColS, Lin, 0), b2(Col, LinA, 0), assertz(ligacelb2(cel(Col, Lin), cel(ColS, LinA)));true)),
	((b2(ColA, LinA, 0), b2(ColA, Lin, 0), b2(Col, LinA, 0), assertz(ligacelb2(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafob2_lin(Col1,Lin).
cria_grafob2_lin(Col,Lin):-Col1 is Col-1,cria_grafob2_lin(Col1,Lin).

%?- cria_grafob2(5,5).
%true.

/*
?- ligacelb2(A,B).
A = cel(4, 5),
B = cel(3, 5) ;
A = cel(4, 5),
B = cel(4, 4) ;
A = cel(3, 5),
B = cel(4, 5) ;
A = cel(3, 5),
B = cel(3, 4) ;
A = cel(5, 4),
B = cel(4, 4) ;
A = cel(4, 4),
B = cel(5, 4) ;
A = cel(4, 4),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(4, 5) ;
A = cel(4, 4),
B = cel(4, 3) ;
(...)
*/

/*
?- findall(_,ligacelb2(_,_),L),length(L,Length).
L = [_2134, _2128, _2122, _2116, _2110, _2104, _2098, _2092, _2086|...],
Length = 38.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelb2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(5,1),cel(4,5),L).
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...] ;
*/


%***********************REBENTA A STACK******************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(5,1),cel(4,5),L),length(L,Length).
L = [[cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2),
 cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(..., ...)|...], [cel(5, 1),
  cel(4, 1), cel(3, 1), cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(..., ...)|...], [cel(5, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 14.
*/

better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(5,1),cel(4,5),L).
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...].
*/


bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelb2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(5,1),cel(4,5),L).
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)|...] ;
(..., ...)
*/




%:-dynamic ligacelb3/2.
%EdificioBPiso3(b3)Matriz5*5
%coluna :1,2,3,4,5
%linha 1:1,1,0,0,C
%linha 2:1,1,0,0,C
%linha 3:P,1,0,0,1
%linha 4:0,0,0,0,E
%linha 5:0,0,0,0,1

%b3(col,lin,valor) 
b3(1,1,1).
b3(2,1,1).
b3(3,1,0).
b3(4,1,0).
b3(5,1,0).

b3(1,2,1).
b3(2,2,1).
b3(3,2,0).
b3(4,2,0).
b3(5,2,0).

b3(1,3,0).
b3(2,3,1).
b3(3,3,0).
b3(4,3,0).
b3(5,3,1).

b3(1,4,0).
b3(2,4,0).
b3(3,4,0).
b3(4,4,0).
b3(5,4,0).

b3(1,5,0).
b3(2,5,0).
b3(3,5,0).
b3(4,5,0).
b3(5,5,1).

%Cria grafo para o piso ligacelb3/2 com a matriz 5*5 b3 definida mais acima
:-dynamic ligacelb3/2.

cria_grafob3(_,0):-!.
cria_grafob3(Col,Lin):-cria_grafob3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafob3(Col,Lin1).

cria_grafob3_lin(0,_):-!.
cria_grafob3_lin(Col,Lin):-b3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((b3(ColS,Lin,0),assertz(ligacelb3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((b3(ColA,Lin,0),assertz(ligacelb3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((b3(Col,LinS,0),assertz(ligacelb3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((b3(Col,LinA,0),assertz(ligacelb3(cel(Col,Lin),cel(Col,LinA)));true)),
	((b3(ColS, LinS, 0), b3(ColS, Lin, 0), b3(Col, LinS, 0), assertz(ligacelb3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((b3(ColA, LinS, 0), b3(ColA, Lin, 0), b3(Col, LinS, 0), assertz(ligacelb3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((b3(ColS, LinA, 0), b3(ColS, Lin, 0), b3(Col, LinA, 0), assertz(ligacelb3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((b3(ColA, LinA, 0), b3(ColA, Lin, 0), b3(Col, LinA, 0), assertz(ligacelb3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafob3_lin(Col1,Lin).
cria_grafob3_lin(Col,Lin):-Col1 is Col-1,cria_grafob3_lin(Col1,Lin).

%?- cria_grafob3(5,5).
%true.

/*
?- ligacelb3(A,B).
A = cel(4, 5),
B = cel(3, 5) ;
A = cel(4, 5),
B = cel(4, 4) ;
A = cel(3, 5),
B = cel(4, 5) ;
A = cel(3, 5),
B = cel(2, 5) ;
A = cel(3, 5),
B = cel(3, 4) ;
A = cel(2, 5),
B = cel(3, 5) ;
A = cel(2, 5),
B = cel(1, 5) ;
A = cel(2, 5),
B = cel(2, 4) ;
A = cel(1, 5),
B = cel(2, 5)
(..., ...)
*/

/*
?- findall(_,ligacelb3(_,_),L),length(L,Length).
L = [_2194, _2188, _2182, _2176, _2170, _2164, _2158, _2152, _2146|...],
Length = 48.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelb3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(5,1),cel(1,5),L).
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(3, 4), cel(..., ...)|...] ;
(..., ...)
*/


%*****REBENTA A STACK ******
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(5,1),cel(1,5),L),length(L,Length).
L = [[cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), cel(3, 3), cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(4, 3), 
cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(4, 2), cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(..., ...)|...], [cel(5, 1),
 cel(4, 1), cel(3, 1), cel(..., ...)|...], [cel(5, 1), cel(4, 1), cel(..., ...)|...], [cel(5, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 98.
*/


%***************REBENTA A STACK *****************

better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(5,1),cel(1,5),L).
L = [cel(5, 1), cel(5, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(4, 5), cel(3, 5), cel(2, 5), cel(..., ...)].
*/


bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelb3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(5,1),cel(1,5),L).
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(2, 4), cel(1, 4), cel(..., ...)] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(2, 4), cel(2, 5), cel(..., ...)] ;
L = [cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(2, 5), cel(..., ...)] ;
L = [cel(5, 1), cel(4, 1), cel(4, 2), cel(3, 2), cel(3, 3), cel(3, 4), cel(2, 4), cel(1, 4), cel(..., ...)] ;
(..., ...)
*/




%:-dynamic ligacelh1/2.
%EdificioHPiso1(h1)Matriz6*6  
%coluna :1,2,3,4,5,6
%linha 1:E,0,0,0,0,0
%linha 2:1,P,0,1,1,1
%linha 3:1,P,0,P,1,1
%linha 4:1,P,0,P,1,1
%linha 5:1,1,P,1,1,1
%linha 6:1,1,1,1,1,1

%h1(col,lin,valor)
h1(1,1,0).
h1(2,1,0).
h1(3,1,0).
h1(4,1,0).
h1(5,1,0).
h1(6,1,0).

h1(1,2,1).
h1(2,2,0).
h1(3,2,0).
h1(4,2,1).
h1(5,2,1).
h1(6,2,1).

h1(1,3,1).
h1(2,3,0).
h1(3,3,0).
h1(4,3,0).
h1(5,3,1).
h1(6,3,1).

h1(1,4,1).
h1(2,4,0).
h1(3,4,0).
h1(4,4,0).
h1(5,4,1).
h1(6,4,1).

h1(1,5,1).
h1(2,5,1).
h1(3,5,0).
h1(4,5,1).
h1(5,5,1).
h1(6,5,1).

h1(1,6,1).
h1(2,6,1).
h1(3,6,1).
h1(4,6,1).
h1(5,6,1).
h1(6,6,1).

%Cria grafo para o piso ligacelh1/2 com a matriz 6*6 h1 definida mais acima
:-dynamic ligacelh1/2.

cria_grafoh1(_,0):-!.
cria_grafoh1(Col,Lin):-cria_grafoh1_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoh1(Col,Lin1).

cria_grafoh1_lin(0,_):-!.
cria_grafoh1_lin(Col,Lin):-h1(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((h1(ColS,Lin,0),assertz(ligacelh1(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((h1(ColA,Lin,0),assertz(ligacelh1(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((h1(Col,LinS,0),assertz(ligacelh1(cel(Col,Lin),cel(Col,LinS)));true)),
    ((h1(Col,LinA,0),assertz(ligacelh1(cel(Col,Lin),cel(Col,LinA)));true)),
	((h1(ColS, LinS, 0), h1(ColS, Lin, 0), h1(Col, LinS, 0), assertz(ligacelh1(cel(Col, Lin), cel(ColS, LinS)));true)),
	((h1(ColA, LinS, 0), h1(ColA, Lin, 0), h1(Col, LinS, 0), assertz(ligacelh1(cel(Col, Lin), cel(ColA, LinS)));true)),
	((h1(ColS, LinA, 0), h1(ColS, Lin, 0), h1(Col, LinA, 0), assertz(ligacelh1(cel(Col, Lin), cel(ColS, LinA)));true)),
	((h1(ColA, LinA, 0), h1(ColA, Lin, 0), h1(Col, LinA, 0), assertz(ligacelh1(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafoh1_lin(Col1,Lin).
cria_grafoh1_lin(Col,Lin):-Col1 is Col-1,cria_grafoh1_lin(Col1,Lin).

%?- cria_grafoh1(6,6).
%true.

/*
?- ligacelh1(A,B).
A = cel(3, 5),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(3, 4) ;
A = cel(4, 4),
B = cel(4, 3) ;
A = cel(3, 4),
B = cel(4, 4) ;
A = cel(3, 4),
B = cel(2, 4) ;
A = cel(3, 4),
B = cel(3, 5) ;
A = cel(3, 4),
B = cel(3, 3) ;
A = cel(2, 4),
B = cel(3, 4) ;
A = cel(2, 4),
B = cel(2, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelh1(_,_),L),length(L,Length).
L = [_12268, _12262, _12256, _12250, _12244, _12238, _12232, _12226, _12220|...],
Length = 36.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelh1(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,5),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(..., ...)|...] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(3, 4), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(2, 3), cel(2, 4), cel(3, 4), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(3, 4), cel(..., ...)] ;
(..., ...)
*/

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

%***ESTE ALGORITMO REBENTA COM A STACK ***********
/*
?- all_dfs(cel(1,1),cel(3,4),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), 
cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(..., ...)|...], [cel(1, 1), 
cel(2, 1), cel(3, 1), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/


%*****ESTE ALGORITMO REBENTA COM A STACK********
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,4),L).
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4)].
*/


bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelh1(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,4),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(2, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(2, 3), cel(2, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(2, 3), cel(2, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(4, 4), cel(3, 4)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3), cel(4, 3), cel(..., ...)|...] ;
(..., ...)
*/




%:-dynamic ligacelh2/2.
%EdificioHPiso2(h2)Matriz6*6
%coluna :1,2,3,4,5,6
%linha 1:E,0,0,0,0,0
%linha 2:1,0,0,P,1,1
%linha 3:P,0,0,1,1,1
%linha 4:1,P,0,P,1,1
%linha 5:1,1,0,0,0,C
%linha 6:1,1,0,0,0,C

%h2(col,lin,valor) 
h2(1,1,0).
h2(2,1,0).
h2(3,1,0).
h2(4,1,0).
h2(5,1,0).
h2(6,1,0).

h2(1,2,1).
h2(2,2,0).
h2(3,2,0).
h2(4,2,0).
h2(5,2,1).
h2(6,2,1).

h2(1,3,0).
h2(2,3,0).
h2(3,3,0).
h2(4,3,1).
h2(5,3,1).
h2(6,3,1).

h2(1,4,1).
h2(2,4,0).
h2(3,4,0).
h2(4,4,0).
h2(5,4,1).
h2(6,4,1).

h2(1,5,1).
h2(2,5,1).
h2(3,5,0).
h2(4,5,0).
h2(5,5,0).
h2(6,5,0).

h2(1,6,1).
h2(2,6,1).
h2(3,6,0).
h2(4,6,0).
h2(5,6,0).
h2(6,6,0).

%Cria grafo para o piso ligacelh2/2 com a matriz 6*6 h2 definida mais acima
:-dynamic ligacelh2/2.

cria_grafoh2(_,0):-!.
cria_grafoh2(Col,Lin):-cria_grafoh2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoh2(Col,Lin1).

cria_grafoh2_lin(0,_):-!.
cria_grafoh2_lin(Col,Lin):-h2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((h2(ColS,Lin,0),assertz(ligacelh2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((h2(ColA,Lin,0),assertz(ligacelh2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((h2(Col,LinS,0),assertz(ligacelh2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((h2(Col,LinA,0),assertz(ligacelh2(cel(Col,Lin),cel(Col,LinA)));true)),
	((h2(ColS, LinS, 0), h2(ColS, Lin, 0), h2(Col, LinS, 0), assertz(ligacelh2(cel(Col, Lin), cel(ColS, LinS)));true)),
	((h2(ColA, LinS, 0), h2(ColA, Lin, 0), h2(Col, LinS, 0), assertz(ligacelh2(cel(Col, Lin), cel(ColA, LinS)));true)),
	((h2(ColS, LinA, 0), h2(ColS, Lin, 0), h2(Col, LinA, 0), assertz(ligacelh2(cel(Col, Lin), cel(ColS, LinA)));true)),
	((h2(ColA, LinA, 0), h2(ColA, Lin, 0), h2(Col, LinA, 0), assertz(ligacelh2(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafoh2_lin(Col1,Lin).
cria_grafoh2_lin(Col,Lin):-Col1 is Col-1,cria_grafoh2_lin(Col1,Lin).

%?- cria_grafoh2(6,6).
%true.

/*
?- ligacelh2(A,B).
A = cel(6, 6),
B = cel(5, 6) ;
A = cel(6, 6),
B = cel(6, 5) ;
A = cel(5, 6),
B = cel(6, 6) ;
A = cel(5, 6),
B = cel(4, 6) ;
A = cel(5, 6),
B = cel(5, 5) ;
A = cel(4, 6),
B = cel(5, 6) ;
A = cel(4, 6),
B = cel(3, 6) ;
A = cel(4, 6),
B = cel(4, 5) ;
A = cel(3, 6),
B = cel(4, 6) ;
(..., ...)
*/

/*
?- findall(_,ligacelh2(_,_),L),length(L,Length).
L = [_2266, _2260, _2254, _2248, _2242, _2236, _2230, _2224, _2218|...],
Length = 60.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelh2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(6,1),cel(5,6),L).
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3), cel(..., ...)|...] ;
(..., ...)
*/

%************ESTE ALGORITMO REBENTA COM A STACK*************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(6,1),cel(5,6),L),length(L,Length).
L = [[cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(2, 2), 
cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(2, 1), cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(..., ...)|...], [cel(6, 1), 
cel(5, 1), cel(4, 1), cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(..., ...)|...], [cel(6, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 140.
*/


%*************ESTE ALGORTIMO REBENTA COM A STACK************

better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(6,1),cel(5,6),L).
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(4, 2), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(..., ...)|...].
*/


bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelh2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(6,1),cel(5,6),L).
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(..., ...)|...] ;
(..., ...)
*/




%:-dynamic ligacelh3/2.
%EdificioHPiso3(h3)Matriz6*6
%coluna :1,2,3,4,5,6
%linha 1:E,0,0,0,0,0
%linha 2:1,1,0,1,1,1
%linha 3:1,P,0,P,1,1
%linha 4:1,P,0,P,1,1
%linha 5:1,0,0,0,0,C
%linha 6:1,P,1,1,0,C

%h3(col,lin,valor) 
h3(1,1,0).
h3(2,1,0).
h3(3,1,0).
h3(4,1,0).
h3(5,1,0).
h3(6,1,0).

h3(1,2,1).
h3(2,2,1).
h3(3,2,0).
h3(4,2,1).
h3(5,2,1).
h3(6,2,1).

h3(1,3,1).
h3(2,3,0).
h3(3,3,0).
h3(4,3,0).
h3(5,3,1).
h3(6,3,1).

h3(1,4,1).
h3(2,4,0).
h3(3,4,0).
h3(4,4,0).
h3(5,4,1).
h3(6,4,1).

h3(1,5,1).
h3(2,5,0).
h3(3,5,0).
h3(4,5,0).
h3(5,5,0).
h3(6,5,0).

h3(1,6,1).
h3(2,6,0).
h3(3,6,1).
h3(4,6,1).
h3(5,6,0).
h3(6,6,0).


%Cria grafo para o piso ligacelh3/2 com a matriz 6*6 h3 definida mais acima
:-dynamic ligacelh3/2.

cria_grafoh3(_,0):-!.
cria_grafoh3(Col,Lin):-cria_grafoh3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoh3(Col,Lin1).

cria_grafoh3_lin(0,_):-!.
cria_grafoh3_lin(Col,Lin):-h3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((h3(ColS,Lin,0),assertz(ligacelh3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((h3(ColA,Lin,0),assertz(ligacelh3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((h3(Col,LinS,0),assertz(ligacelh3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((h3(Col,LinA,0),assertz(ligacelh3(cel(Col,Lin),cel(Col,LinA)));true)),
	((h3(ColS, LinS, 0), h3(ColS, Lin, 0), h3(Col, LinS, 0), assertz(ligacelh3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((h3(ColA, LinS, 0), h3(ColA, Lin, 0), h3(Col, LinS, 0), assertz(ligacelh3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((h3(ColS, LinA, 0), h3(ColS, Lin, 0), h3(Col, LinA, 0), assertz(ligacelh3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((h3(ColA, LinA, 0), h3(ColA, Lin, 0), h3(Col, LinA, 0), assertz(ligacelh3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafoh3_lin(Col1,Lin).
cria_grafoh3_lin(Col,Lin):-Col1 is Col-1,cria_grafoh3_lin(Col1,Lin).

%?- cria_grafoh3(6,6).
%true.

/*
?- ligacelh3(A,B).
A = cel(6, 6),
B = cel(5, 6) ;
A = cel(6, 6),
B = cel(6, 5) ;
A = cel(5, 6),
B = cel(6, 6) ;
A = cel(5, 6),
B = cel(5, 5) ;
A = cel(2, 6),
B = cel(2, 5) ;
A = cel(6, 5),
B = cel(5, 5) ;
A = cel(6, 5),
B = cel(6, 6) ;
A = cel(5, 5),
B = cel(6, 5) ;
(..., ...)
*/

/*
?- findall(_,ligacelh3(_,_),L),length(L,Length).
L = [_2206, _2200, _2194, _2188, _2182, _2176, _2170, _2164, _2158|...],
Length = 50.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelh3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(6,1),cel(6,6),L).
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
(..., ...)
*/

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(6,1),cel(6,6),L),length(L,Length).
L = [[cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), 
cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(..., ...)|...], [cel(6, 1), 
cel(5, 1), cel(4, 1), cel(..., ...)|...], [cel(6, 1), cel(5, 1), cel(..., ...)|...], [cel(6, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 20.
*/


%*****************ESTE ALGORITMO REBENTA COM A STACK ***********************
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(6,1),cel(6,6),L).
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(..., ...)|...].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelh3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(6,1),cel(6,6),L).
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(4, 3), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(4, 4), cel(..., ...)|...] ;
L = [cel(6, 1), cel(5, 1), cel(4, 1), cel(3, 1), cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(..., ...)|...] ;
(..., ...)
*/




%:-dynamic ligacelg2/2.
%EdificioGPiso2(g2)Matriz7*7
%coluna :1,2,3,4,5,6,7
%linha 1:1,1,1,1,P,1,E
%linha 2:C,P,1,P,0,0,0
%linha 3:C,0,0,0,0,0,0
%linha 4:P,0,0,0,0,0,0
%linha 5:1,0,0,0,0,0,C	
%linha 6:1,P,P,1,0,0,C
%linha 7:1,1,1,1,P,1,1

%g2(col,lin,valor)  (7,1) ate (7,6)
g2(1,1,1).
g2(2,1,1).
g2(3,1,1).
g2(4,1,1).
g2(5,1,0).
g2(6,1,1).
g2(7,1,0).

g2(1,2,0).
g2(2,2,0).
g2(3,2,1).
g2(4,2,0).
g2(5,2,0).
g2(6,2,0).
g2(7,2,0).

g2(1,3,1).
g2(2,3,0).
g2(3,3,0).
g2(4,3,0).
g2(5,3,0).
g2(6,3,0).
g2(7,3,0).

g2(1,4,0).
g2(2,4,0).
g2(3,4,0).
g2(4,4,0).
g2(5,4,0).
g2(6,4,0).
g2(7,4,0).

g2(1,5,1).
g2(2,5,0).
g2(3,5,0).
g2(4,5,0).
g2(5,5,0).
g2(6,5,0).
g2(7,5,0).

g2(1,6,1).
g2(2,6,0).
g2(3,6,0).
g2(4,6,1).
g2(5,6,0).
g2(6,6,0).
g2(7,6,0).

g2(1,7,1).
g2(2,7,1).
g2(3,7,1).
g2(4,7,1).
g2(5,7,0).
g2(6,7,1).
g2(7,7,1).


%Cria grafo para o piso ligacelg2/2 com a matriz 7*7 g2 definida mais acima
:-dynamic ligacelg2/2.

cria_grafog2(_,0):-!.
cria_grafog2(Col,Lin):-cria_grafog2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafog2(Col,Lin1).

cria_grafog2_lin(0,_):-!.
cria_grafog2_lin(Col,Lin):-g2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((g2(ColS,Lin,0),assertz(ligacelg2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((g2(ColA,Lin,0),assertz(ligacelg2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((g2(Col,LinS,0),assertz(ligacelg2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((g2(Col,LinA,0),assertz(ligacelg2(cel(Col,Lin),cel(Col,LinA)));true)),
	((g2(ColS, LinS, 0), g2(ColS, Lin, 0), g2(Col, LinS, 0), assertz(ligacelg2(cel(Col, Lin), cel(ColS, LinS)));true)),
	((g2(ColA, LinS, 0), g2(ColA, Lin, 0), g2(Col, LinS, 0), assertz(ligacelg2(cel(Col, Lin), cel(ColA, LinS)));true)),
	((g2(ColS, LinA, 0), g2(ColS, Lin, 0), g2(Col, LinA, 0), assertz(ligacelg2(cel(Col, Lin), cel(ColS, LinA)));true)),
	((g2(ColA, LinA, 0), g2(ColA, Lin, 0), g2(Col, LinA, 0), assertz(ligacelg2(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafog2_lin(Col1,Lin).
cria_grafog2_lin(Col,Lin):-Col1 is Col-1,cria_grafog2_lin(Col1,Lin).

%?- cria_grafog2(7,7).
%true.

/*
?- ligacelg2(A,B).
A = cel(5, 7),
B = cel(5, 6) ;
A = cel(7, 6),
B = cel(6, 6) ;
A = cel(7, 6),
B = cel(7, 5) ;
A = cel(6, 6),
B = cel(7, 6) ;
A = cel(6, 6),
B = cel(5, 6) ;
A = cel(6, 6),
B = cel(6, 5) ;
A = cel(5, 6),
B = cel(6, 6) ;
A = cel(5, 6),
B = cel(5, 7) ;
A = cel(5, 6),
B = cel(5, 5) ;
(..., ...)
*/

/*
?- findall(_,ligacelg2(_,_),L),length(L,Length).
L = [_3832, _3826, _3820, _3814, _3808, _3802, _3796, _3790, _3784|...],
Length = 96.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelg2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(7,1),cel(7,6),L).
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(6, 3), cel(..., ...)|...] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(6, 3), cel(..., ...)|...] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(6, 3), cel(..., ...)|...] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(6, 3), cel(..., ...)|...] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(6, 3), cel(..., ...)|...] ;
(..., ...)
*/

%*************************ESTE ALGORTIMO REBENTA COM A STACK********************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(7,1),cel(7,6),L),length(L,Length).
L = [[cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(..., ...)|...], [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(4, 3),
 cel(..., ...)|...], [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(4, 2), cel(..., ...)|...], [cel(7, 1), cel(7, 2), cel(6, 2), cel(5, 2), cel(..., ...)|...], [cel(7, 1), 
 cel(7, 2), cel(6, 2), cel(..., ...)|...], [cel(7, 1), cel(7, 2), cel(..., ...)|...], [cel(7, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 5167.
*/


%*****************ESTE ALGORTIMO REBENTA COM A STACK**************
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(7,1),cel(7,6),L).
L = [cel(7, 1), cel(7, 2), cel(7, 3), cel(7, 4), cel(7, 5), cel(7, 6)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelg2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(7,1),cel(7,6),L).
L = [cel(7, 1), cel(7, 2), cel(7, 3), cel(7, 4), cel(7, 5), cel(7, 6)] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(6, 3), cel(7, 3), cel(7, 4), cel(7, 5), cel(7, 6)] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(6, 3), cel(6, 4), cel(7, 4), cel(7, 5), cel(7, 6)] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(6, 3), cel(6, 4), cel(6, 5), cel(7, 5), cel(7, 6)] ;
L = [cel(7, 1), cel(7, 2), cel(6, 2), cel(6, 3), cel(6, 4), cel(6, 5), cel(6, 6), cel(7, 6)] ;
(..., ...)
*/




%:-dynamic ligacelg3/2.
%EdificioGPiso3(g3)Matriz7*7
%coluna :1,2,3,4,5,6,7
%linha 1:1,1,1,1,1,1,E
%linha 2:1,1,0,0,0,0,0
%linha 3:1,1,0,0,0,0,0
%linha 4:1,P,0,0,0,0,0
%linha 5:1,1,0,0,0,0,C	
%linha 6:1,1,1,0,0,0,C
%linha 7:1,1,1,0,0,1,1

%g3(col,lin,valor) (3,2) a (5,7)
g3(1,1,1).
g3(2,1,1).
g3(3,1,1).
g3(4,1,1).
g3(5,1,1).
g3(6,1,1).
g3(7,1,0).

g3(1,2,1).
g3(2,2,1).
g3(3,2,0).
g3(4,2,0).
g3(5,2,0).
g3(6,2,0).
g3(7,2,0).

g3(1,3,1).
g3(2,3,1).
g3(3,3,0).
g3(4,3,0).
g3(5,3,0).
g3(6,3,0).
g3(7,3,0).

g3(1,4,1).
g3(2,4,0).
g3(3,4,0).
g3(4,4,0).
g3(5,4,0).
g3(6,4,0).
g3(7,4,0).

g3(1,5,1).
g3(2,5,1).
g3(3,5,0).
g3(4,5,0).
g3(5,5,0).
g3(6,5,0).
g3(7,5,0).

g3(1,6,1).
g3(2,6,1).
g3(3,6,1).
g3(4,6,0).
g3(5,6,0).
g3(6,6,0).
g3(7,6,0).

g3(1,7,1).
g3(2,7,1).
g3(3,7,1).
g3(4,7,0).
g3(5,7,0).
g3(6,7,1).
g3(7,7,1).

%Cria grafo para o piso ligacelg3/2 com a matriz 7*7 g3 definida mais acima
:-dynamic ligacelg3/2.

cria_grafog3(_,0):-!.
cria_grafog3(Col,Lin):-cria_grafog3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafog3(Col,Lin1).

cria_grafog3_lin(0,_):-!.
cria_grafog3_lin(Col,Lin):-g3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((g3(ColS,Lin,0),assertz(ligacelg3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((g3(ColA,Lin,0),assertz(ligacelg3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((g3(Col,LinS,0),assertz(ligacelg3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((g3(Col,LinA,0),assertz(ligacelg3(cel(Col,Lin),cel(Col,LinA)));true)),
	((g3(ColS, LinS, 0), g3(ColS, Lin, 0), g3(Col, LinS, 0), assertz(ligacelg3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((g3(ColA, LinS, 0), g3(ColA, Lin, 0), g3(Col, LinS, 0), assertz(ligacelg3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((g3(ColS, LinA, 0), g3(ColS, Lin, 0), g3(Col, LinA, 0), assertz(ligacelg3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((g3(ColA, LinA, 0), g3(ColA, Lin, 0), g3(Col, LinA, 0), assertz(ligacelg3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafog3_lin(Col1,Lin).
cria_grafog3_lin(Col,Lin):-Col1 is Col-1,cria_grafog3_lin(Col1,Lin).

%?- cria_grafog3(7,7).
%true.

/*
?- ligacelg3(A,B).
A = cel(5, 7),
B = cel(4, 7) ;
A = cel(5, 7),
B = cel(5, 6) ;
A = cel(4, 7),
B = cel(5, 7) ;
A = cel(4, 7),
B = cel(4, 6) ;
A = cel(7, 6),
B = cel(6, 6) ;
A = cel(7, 6),
B = cel(7, 5) ;
A = cel(6, 6),
B = cel(7, 6) ;
A = cel(6, 6),
B = cel(5, 6) ;
A = cel(6, 6),
B = cel(6, 5) ;
(..., ...)
*/

/*
?- findall(_,ligacelg3(_,_),L),length(L,Length).
L = [_4852, _4846, _4840, _4834, _4828, _4822, _4816, _4810, _4804|...],
Length = 86.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelg3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(3,2),cel(5,7),L).
L = [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), cel(6, 3), cel(5, 3), cel(..., ...)|...] ;
L = [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), cel(6, 3), cel(5, 3), cel(..., ...)|...] ;
L = [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), cel(6, 3), cel(5, 3), cel(..., ...)|...] ;
L = [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), cel(6, 3), cel(5, 3), cel(..., ...)|...] ;
L = [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), cel(6, 3), cel(5, 3), cel(..., ...)|...] ;
(..., ...)
*/


%*****************ALGORTIMO REBENTA COM A STACK************************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(3,2),cel(5,7),L),length(L,Length).
L = [[cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), cel(6, 3), cel(..., ...)|...], [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(7, 3), 
cel(..., ...)|...], [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(7, 2), cel(..., ...)|...], [cel(3, 2), cel(4, 2), cel(5, 2), cel(6, 2), cel(..., ...)|...], [cel(3, 2), 
cel(4, 2), cel(5, 2), cel(..., ...)|...], [cel(3, 2), cel(4, 2), cel(..., ...)|...], [cel(3, 2), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 8007.
*/

%****************ALGORITMO REBENTA COM A STACK*********************
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(3,2),cel(5,7),L).
L = [cel(3, 2), cel(3, 3), cel(3, 4), cel(3, 5), cel(4, 5), cel(4, 6), cel(4, 7), cel(5, 7)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelg3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(3,2),cel(5,7),L).
L = [cel(3, 2), cel(4, 2), cel(5, 2), cel(5, 3), cel(5, 4), cel(5, 5), cel(5, 6), cel(5, 7)] ;
L = [cel(3, 2), cel(4, 2), cel(4, 3), cel(5, 3), cel(5, 4), cel(5, 5), cel(5, 6), cel(5, 7)] ;
L = [cel(3, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(5, 4), cel(5, 5), cel(5, 6), cel(5, 7)] ;
L = [cel(3, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(4, 5), cel(5, 5), cel(5, 6), cel(5, 7)] ;
L = [cel(3, 2), cel(4, 2), cel(4, 3), cel(4, 4), cel(4, 5), cel(4, 6), cel(5, 6), cel(5, 7)] ;
(..., ...)
*/




%:-dynamic ligacelcb2g2/2.
%corredorb2g2 Matriz3*3
%coluna :1,2,3
%linha 1:0,0,0
%linha 2:0,0,0
%linha 3:0,0,0

b2g2(1,1,0).
b2g2(2,1,0).
b2g2(3,1,0).

b2g2(1,2,0).
b2g2(2,2,0).
b2g2(3,2,0).

b2g2(1,3,0).
b2g2(2,3,0).
b2g2(3,3,0).

%Cria grafo para o corredor ligacelcb2g2/2 com a matriz 3*3 cb2g2 definida mais acima
:-dynamic ligacelcb2g2/2.

cria_grafocb2g2(_,0):-!.
cria_grafocb2g2(Col,Lin):-cria_grafocb2g2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafocb2g2(Col,Lin1).

cria_grafocb2g2_lin(0,_):-!.
cria_grafocb2g2_lin(Col,Lin):-b2g2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((b2g2(ColS,Lin,0),assertz(ligacelcb2g2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((b2g2(ColA,Lin,0),assertz(ligacelcb2g2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((b2g2(Col,LinS,0),assertz(ligacelcb2g2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((b2g2(Col,LinA,0),assertz(ligacelcb2g2(cel(Col,Lin),cel(Col,LinA)));true)),
	((b2g2(ColS, LinS, 0), b2g2(ColS, Lin, 0), b2g2(Col, LinS, 0), assertz(ligacelb2g2(cel(Col, Lin), cel(ColS, LinS)));true)),
	((b2g2(ColA, LinS, 0), b2g2(ColA, Lin, 0), b2g2(Col, LinS, 0), assertz(ligacelb2g2(cel(Col, Lin), cel(ColA, LinS)));true)),
	((b2g2(ColS, LinA, 0), b2g2(ColS, Lin, 0), b2g2(Col, LinA, 0), assertz(ligacelb2g2(cel(Col, Lin), cel(ColS, LinA)));true)),
	((b2g2(ColA, LinA, 0), b2g2(ColA, Lin, 0), b2g2(Col, LinA, 0), assertz(ligacelb2g2(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafocb2g2_lin(Col1,Lin).
cria_grafocb2g2_lin(Col,Lin):-Col1 is Col-1,cria_grafocb2g2_lin(Col1,Lin).

%?- cria_grafocb2g2(3,3).
%true.

/*
?- ligacelcb2g2(A,B).
A = cel(3, 3),
B = cel(2, 3) ;
A = cel(3, 3),
B = cel(3, 2) ;
A = cel(2, 3),
B = cel(3, 3) ;
A = cel(2, 3),
B = cel(1, 3) ;
A = cel(2, 3),
B = cel(2, 2) ;
A = cel(1, 3),
B = cel(2, 3) ;
A = cel(1, 3),
B = cel(1, 2) ;
A = cel(3, 2),
B = cel(2, 2) ;
A = cel(3, 2),
B = cel(3, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelcb2g2(_,_),L),length(L,Length).
L = [_4392, _4386, _4380, _4374, _4368, _4362, _4356, _4350, _4344|...],
Length = 24.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelcb2g2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/


%*******************ALGORITMO REBENTA COM A STACK *********************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(1,1),cel(3,3),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/


%************ESTE ALGORTIMO REBENTA A STACK***************
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)].
*/

%*****************NAO REBENTA A STACK MAS FICA MUITO TEMPO PARA MOSTRAR O RESULTADO*****
bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelcb2g2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/




%consult("cb3i3.pl").

%:-dynamic ligacelcb3i3/2.
%corredorb3i3 Matriz3*3
%coluna :1,2,3
%linha 1:0,0,0
%linha 2:0,0,0
%linha 3:0,0,0

cb3i3(1,1,0).
cb3i3(2,1,0).
cb3i3(3,1,0).

cb3i3(1,2,0).
cb3i3(2,2,0).
cb3i3(3,2,0).

cb3i3(1,3,0).
cb3i3(2,3,0).
cb3i3(3,3,0).


%Cria grafo para o corredor ligacelcb3i3/2 com a matriz 3*3 cb3i3 definida mais acima
:-dynamic ligacelcb3i3/2.

cria_grafocb3i3(_,0):-!.
cria_grafocb3i3(Col,Lin):-cria_grafocb3i3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafocb3i3(Col,Lin1).

cria_grafocb3i3_lin(0,_):-!.
cria_grafocb3i3_lin(Col,Lin):-cb3i3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((cb3i3(ColS,Lin,0),assertz(ligacelcb3i3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((cb3i3(ColA,Lin,0),assertz(ligacelcb3i3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((cb3i3(Col,LinS,0),assertz(ligacelcb3i3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((cb3i3(Col,LinA,0),assertz(ligacelcb3i3(cel(Col,Lin),cel(Col,LinA)));true)),
	((cb3i3(ColS, LinS, 0), cb3i3(ColS, Lin, 0), cb3i3(Col, LinS, 0), assertz(ligacelcb3i3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((cb3i3(ColA, LinS, 0), cb3i3(ColA, Lin, 0), cb3i3(Col, LinS, 0), assertz(ligacelcb3i3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((cb3i3(ColS, LinA, 0), cb3i3(ColS, Lin, 0), cb3i3(Col, LinA, 0), assertz(ligacelcb3i3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((cb3i3(ColA, LinA, 0), cb3i3(ColA, Lin, 0), cb3i3(Col, LinA, 0), assertz(ligacelcb3i3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafocb3i3_lin(Col1,Lin).
cria_grafocb3i3_lin(Col,Lin):-Col1 is Col-1,cria_grafocb3i3_lin(Col1,Lin).

%?- cria_grafocb3i3(3,3).
%true.

/*
?- ligacelcb3i3(A,B).
A = cel(3, 3),
B = cel(2, 3) ;
A = cel(3, 3),
B = cel(3, 2) ;
A = cel(2, 3),
B = cel(3, 3) ;
A = cel(2, 3),
B = cel(1, 3) ;
A = cel(2, 3),
B = cel(2, 2) ;
A = cel(1, 3),
B = cel(2, 3) ;
A = cel(1, 3),
B = cel(1, 2) ;
A = cel(3, 2),
B = cel(2, 2) ;
A = cel(3, 2),
B = cel(3, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelcb3i3(_,_),L),length(L,Length).
L = [_4392, _4386, _4380, _4374, _4368, _4362, _4356, _4350, _4344|...],
Length = 24.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelcb3i3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)]
(..., ...)
*/

%***************ALGORITMO NAO REBENTA A STACK MAS FICA IMENSO TEMPO SEM MOSTRAR RESULTADO********
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(1,1),cel(3,3),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/

%***********NAO REBENTA MAS FICA MUITO TEMPO SEM MOSTRAR RESULTADO***********
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelcb3i3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/




%:-dynamic ligacelcb3g3/2.
%corredor b3g3 Matriz3*3
%coluna :1,2,3
%linha 1:0,0,0
%linha 2:0,0,0
%linha 3:0,0,0

cb3g3(1,1,0).
cb3g3(2,1,0).
cb3g3(3,1,0).

cb3g3(1,2,0).
cb3g3(2,2,0).
cb3g3(3,2,0).

cb3g3(1,3,0).
cb3g3(2,3,0).
cb3g3(3,3,0).


%Cria grafo para o corredor ligacelcb3g3/2 com a matriz 3*3 cb3g3 definida mais acima
:-dynamic ligacelcb3g3/2.

cria_grafocb3g3(_,0):-!.
cria_grafocb3g3(Col,Lin):-cria_grafocb3g3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafocb3g3(Col,Lin1).

cria_grafocb3g3_lin(0,_):-!.
cria_grafocb3g3_lin(Col,Lin):-cb3g3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((cb3g3(ColS,Lin,0),assertz(ligacelcb3g3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((cb3g3(ColA,Lin,0),assertz(ligacelcb3g3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((cb3g3(Col,LinS,0),assertz(ligacelcb3g3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((cb3g3(Col,LinA,0),assertz(ligacelcb3g3(cel(Col,Lin),cel(Col,LinA)));true)),
	((cb3g3(ColS, LinS, 0), cb3g3(ColS, Lin, 0), cb3g3(Col, LinS, 0), assertz(ligacelcb3g3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((cb3g3(ColA, LinS, 0), cb3g3(ColA, Lin, 0), cb3g3(Col, LinS, 0), assertz(ligacelcb3g3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((cb3g3(ColS, LinA, 0), cb3g3(ColS, Lin, 0), cb3g3(Col, LinA, 0), assertz(ligacelcb3g3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((cb3g3(ColA, LinA, 0), cb3g3(ColA, Lin, 0), cb3g3(Col, LinA, 0), assertz(ligacelcb3g3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafocb3g3_lin(Col1,Lin).
cria_grafocb3g3_lin(Col,Lin):-Col1 is Col-1,cria_grafocb3g3_lin(Col1,Lin).

%?- cria_grafocb3g3(3,3).
%true.

/*
?- ligacelcb3i3(A,B).
A = cel(3, 3),
B = cel(2, 3) ;
A = cel(3, 3),
B = cel(3, 2) ;
A = cel(2, 3),
B = cel(3, 3) ;
A = cel(2, 3),
B = cel(1, 3) ;
A = cel(2, 3),
B = cel(2, 2) ;
A = cel(1, 3),
B = cel(2, 3) ;
A = cel(1, 3),
B = cel(1, 2) ;
A = cel(3, 2),
B = cel(2, 2) ;
A = cel(3, 2),
B = cel(3, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelcb3i3(_,_),L),length(L,Length).
L = [_4392, _4386, _4380, _4374, _4368, _4362, _4356, _4350, _4344|...],
Length = 24.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelcb3g3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)]
(..., ...)
*/

all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(1,1),cel(3,3),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/

%***********ALGORITMO NAO REBENTA MAS FICA DURANTE MUITO TEMPO***************
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelcb3g3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/




%:-dynamic ligacelch2i2/2.
%corredor h2i2 Matriz3*3
%coluna :1,2,3
%linha 1:0,0,0
%linha 2:0,0,0
%linha 3:0,0,0

ch2i2(1,1,0).
ch2i2(2,1,0).
ch2i2(3,1,0).

ch2i2(1,2,0).
ch2i2(2,2,0).
ch2i2(3,2,0).

ch2i2(1,3,0).
ch2i2(2,3,0).
ch2i2(3,3,0).



%Cria grafo para o corredor ligacelch2i2/2 com a matriz 3*3 ch2i2 definida mais acima
:-dynamic ligacelch2i2/2.

cria_grafoch2i2(_,0):-!.
cria_grafoch2i2(Col,Lin):-cria_grafoch2i2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafoch2i2(Col,Lin1).

cria_grafoch2i2_lin(0,_):-!.
cria_grafoch2i2_lin(Col,Lin):-ch2i2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((ch2i2(ColS,Lin,0),assertz(ligacelch2i2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((ch2i2(ColA,Lin,0),assertz(ligacelch2i2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((ch2i2(Col,LinS,0),assertz(ligacelch2i2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((ch2i2(Col,LinA,0),assertz(ligacelch2i2(cel(Col,Lin),cel(Col,LinA)));true)),
	((ch2i2(ColS, LinS, 0), ch2i2(ColS, Lin, 0), ch2i2(Col, LinS, 0), assertz(ligacelch2i2(cel(Col, Lin), cel(ColS, LinS)));true)),
	((ch2i2(ColA, LinS, 0), ch2i2(ColA, Lin, 0), ch2i2(Col, LinS, 0), assertz(ligacelch2i2(cel(Col, Lin), cel(ColA, LinS)));true)),
	((ch2i2(ColS, LinA, 0), ch2i2(ColS, Lin, 0), ch2i2(Col, LinA, 0), assertz(ligacelch2i2(cel(Col, Lin), cel(ColS, LinA)));true)),
	((ch2i2(ColA, LinA, 0), ch2i2(ColA, Lin, 0), ch2i2(Col, LinA, 0), assertz(ligacelch2i2(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafoch2i2_lin(Col1,Lin).
cria_grafoch2i2_lin(Col,Lin):-Col1 is Col-1,cria_grafoch2i2_lin(Col1,Lin).

%?- cria_grafoch2i2(3,3).
%true.

/*
?- ligacelch2i2(A,B).
A = cel(3, 3),
B = cel(2, 3) ;
A = cel(3, 3),
B = cel(3, 2) ;
A = cel(2, 3),
B = cel(3, 3) ;
A = cel(2, 3),
B = cel(1, 3) ;
A = cel(2, 3),
B = cel(2, 2) ;
A = cel(1, 3),
B = cel(2, 3) ;
A = cel(1, 3),
B = cel(1, 2) ;
A = cel(3, 2),
B = cel(2, 2) ;
A = cel(3, 2),
B = cel(3, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelch2i2(_,_),L),length(L,Length).
L = [_2106, _2100, _2094, _2088, _2082, _2076, _2070, _2064, _2058|...],
Length = 24.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelch2i2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)]
(..., ...)
*/

%********************** NAO REBENTA A STACK MAS DEMORA MUITO TEMPO A PROCESSAR**********
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(1,1),cel(3,3),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/


%*********************FICA IMENSO TEMPO A PROCESSAR MAS NAO REBENTA A STACK*******
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelch2i2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/




%:-dynamic ligacelcg2h2/2.
%corredor g2h2 Matriz3*3
%coluna :1,2,3
%linha 1:0,0,0
%linha 2:0,0,0
%linha 3:0,0,0

cg2h2(1,1,0).
cg2h2(2,1,0).
cg2h2(3,1,0).

cg2h2(1,2,0).
cg2h2(2,2,0).
cg2h2(3,2,0).

cg2h2(1,3,0).
cg2h2(2,3,0).
cg2h2(3,3,0).

%Cria grafo para o corredor ligacelcg2h2/2 com a matriz 3*3 g2h2 definida mais acima
:-dynamic ligacelcg2h2/2.

cria_grafocg2h2(_,0):-!.
cria_grafocg2h2(Col,Lin):-cria_grafocg2h2_lin(Col,Lin),Lin1 is Lin-
1,cria_grafocg2h2(Col,Lin1).

cria_grafocg2h2_lin(0,_):-!.
cria_grafocg2h2_lin(Col,Lin):-cg2h2(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((cg2h2(ColS,Lin,0),assertz(ligacelcg2h2(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((cg2h2(ColA,Lin,0),assertz(ligacelcg2h2(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((cg2h2(Col,LinS,0),assertz(ligacelcg2h2(cel(Col,Lin),cel(Col,LinS)));true)),
    ((cg2h2(Col,LinA,0),assertz(ligacelcg2h2(cel(Col,Lin),cel(Col,LinA)));true)),
	((cg2h2(ColS, LinS, 0), cg2h2(ColS, Lin, 0), cg2h2(Col, LinS, 0), assertz(ligacelcg2h2(cel(Col, Lin), cel(ColS, LinS)));true)),
	((cg2h2(ColA, LinS, 0), cg2h2(ColA, Lin, 0), cg2h2(Col, LinS, 0), assertz(ligacelcg2h2(cel(Col, Lin), cel(ColA, LinS)));true)),
	((cg2h2(ColS, LinA, 0), cg2h2(ColS, Lin, 0), cg2h2(Col, LinA, 0), assertz(ligacelcg2h2(cel(Col, Lin), cel(ColS, LinA)));true)),
	((cg2h2(ColA, LinA, 0), cg2h2(ColA, Lin, 0), cg2h2(Col, LinA, 0), assertz(ligacelcg2h2(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafocg2h2_lin(Col1,Lin).
cria_grafocg2h2_lin(Col,Lin):-Col1 is Col-1,cria_grafocg2h2_lin(Col1,Lin).

%?- cria_grafocg2h2(3,3).
%true.

/*
?- ligacelcg2h2(A,B).
A = cel(3, 3),
B = cel(2, 3) ;
A = cel(3, 3),
B = cel(3, 2) ;
A = cel(2, 3),
B = cel(3, 3) ;
A = cel(2, 3),
B = cel(1, 3) ;
A = cel(2, 3),
B = cel(2, 2) ;
A = cel(1, 3),
B = cel(2, 3) ;
A = cel(1, 3),
B = cel(1, 2) ;
A = cel(3, 2),
B = cel(2, 2) ;
A = cel(3, 2),
B = cel(3, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelcg2h2(_,_),L),length(L,Length).
L = [_11728, _11722, _11716, _11710, _11704, _11698, _11692, _11686, _11680|...],
Length = 24.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelcg2h2(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)]
(..., ...)
*/

%**************NAO REBENTA A STACK MAS FICA IMENSO TEMPO A PENSAR******************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(1,1),cel(3,3),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/

%************NAO REBENTA A STACK MAS FICA IMENSO TEMPO A PENSAR ***********
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelcg2h2(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/




%:-dynamic ligacelcg3h3/2.
%corredor g3h3 Matriz3*3
%coluna :1,2,3
%linha 1:0,0,0
%linha 2:0,0,0
%linha 3:0,0,0

cg3h3(1,1,0).
cg3h3(2,1,0).
cg3h3(3,1,0).

cg3h3(1,2,0).
cg3h3(2,2,0).
cg3h3(3,2,0).

cg3h3(1,3,0).
cg3h3(2,3,0).
cg3h3(3,3,0).

%Cria grafo para o corredor ligacelcg3h3/2 com a matriz 3*3 cg3h3 definida mais acima
:-dynamic ligacelcg3h3/2.

cria_grafocg3h3(_,0):-!.
cria_grafocg3h3(Col,Lin):-cria_grafocg3h3_lin(Col,Lin),Lin1 is Lin-
1,cria_grafocg3h3(Col,Lin1).

cria_grafocg3h3_lin(0,_):-!.
cria_grafocg3h3_lin(Col,Lin):-cg3h3(Col,Lin,0),!,
       ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
    ((cg3h3(ColS,Lin,0),assertz(ligacelcg3h3(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((cg3h3(ColA,Lin,0),assertz(ligacelcg3h3(cel(Col,Lin),cel(ColA,Lin)));true)),
    ((cg3h3(Col,LinS,0),assertz(ligacelcg3h3(cel(Col,Lin),cel(Col,LinS)));true)),
    ((cg3h3(Col,LinA,0),assertz(ligacelcg3h3(cel(Col,Lin),cel(Col,LinA)));true)),
	((cg3h3(ColS, LinS, 0), cg3h3(ColS, Lin, 0), cg3h3(Col, LinS, 0), assertz(ligacelcg3h3(cel(Col, Lin), cel(ColS, LinS)));true)),
	((cg3h3(ColA, LinS, 0), cg3h3(ColA, Lin, 0), cg3h3(Col, LinS, 0), assertz(ligacelcg3h3(cel(Col, Lin), cel(ColA, LinS)));true)),
	((cg3h3(ColS, LinA, 0), cg3h3(ColS, Lin, 0), cg3h3(Col, LinA, 0), assertz(ligacelcg3h3(cel(Col, Lin), cel(ColS, LinA)));true)),
	((cg3h3(ColA, LinA, 0), cg3h3(ColA, Lin, 0), cg3h3(Col, LinA, 0), assertz(ligacelcg3h3(cel(Col, Lin), cel(ColA, LinA)));true)),
    Col1 is Col-1,
    cria_grafocg3h3_lin(Col1,Lin).
cria_grafocg3h3_lin(Col,Lin):-Col1 is Col-1,cria_grafocg3h3_lin(Col1,Lin).

%?- cria_grafocg3h3(3,3).
%true.

/*
?- ligacelcg3h3(A,B).
A = cel(3, 3),
B = cel(2, 3) ;
A = cel(3, 3),
B = cel(3, 2) ;
A = cel(2, 3),
B = cel(3, 3) ;
A = cel(2, 3),
B = cel(1, 3) ;
A = cel(2, 3),
B = cel(2, 2) ;
A = cel(1, 3),
B = cel(2, 3) ;
A = cel(1, 3),
B = cel(1, 2) ;
A = cel(3, 2),
B = cel(2, 2) ;
A = cel(3, 2),
B = cel(3, 3) ;
(..., ...)
*/

/*
?- findall(_,ligacelcg3h3(_,_),L),length(L,Length).
L = [_2106, _2100, _2094, _2088, _2082, _2076, _2070, _2064, _2058|...],
Length = 24.
*/

dfs(Orig,Dest,Cam):-
	dfs2(Orig,Dest,[Orig],Cam).

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacelcg3h3(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).

/*
?- dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(..., ...)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)]
(..., ...)
*/

%***NAO REBENTA A STACK MAS DEMORA IMENSO TEMPO A PENSAR ***************
all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).

/*
?- all_dfs(cel(1,1),cel(3,3),L),length(L,Length).
L = [[cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(1, 2), cel(1, 3), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(2, 2), cel(2, 3), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(..., ...)], [cel(1, 1), cel(2, 1), cel(2, 2), cel(..., ...)|...], [cel(1, 1), cel(2, 1), cel(..., ...)|...], [cel(1, 1), cel(..., ...)|...], [cel(..., ...)|...], [...|...]|...],
Length = 12.
*/

%***NAO REBENTA A STACK MAS DEMORA IMENSO TEMPO A PENSAR ***************
better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).

shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).

/*
?- better_dfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)].
*/

bfs(Orig,Dest,Cam):-bfs2(Dest,[[Orig]],Cam).

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacelcg3h3(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

/*
Permite identificar a ou as soluções com o menor numero de elementos.
?- bfs(cel(1,1),cel(3,3),L).
L = [cel(1, 1), cel(2, 1), cel(3, 1), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(2, 1), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(3, 2), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(2, 2), cel(2, 3), cel(3, 3)] ;
L = [cel(1, 1), cel(1, 2), cel(1, 3), cel(2, 3), cel(3, 3)] ;
(..., ...)
*/














 













 

















 








