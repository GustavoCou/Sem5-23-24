consult("4_us515_aStar.pl").
%EDIFICIO PESOS
node(a,45,95).
node(b,90,95).
node(c,15,85).
node(d,40,80).


edge(a,b,45).
edge(b,c,25).
edge(b,d,40).
edge(d,c,30).

%SALAS DE PISOS
node(d101, 10, 15).
node(d102,10, 12).
node(d103,10, 10).
node(d104,20, 10).
node(d105,20, 20).
node(d106,5, 5).
node(d107,5, 10).
node(d108,3, 10).



%SALAS DE PISOS
node(c101, 10, 15).
node(c102,10, 12).
node(a103,10, 10).
node(b104,20, 10).
node(c105,20, 20).
node(c106,5, 5).
node(a107,5, 10).
node(a108,3, 10).




%LIGACOES 
edge(d108, d105, 10).
edge(d108, c105, 30).

edge(d106, d105, 1).
edge(d107, d106, 9).
edge(d101, d107, 16).
edge(d102, d101, 12).
edge(d101, c105, 3).
edge(c105, c106, 2).
edge(c106, a107, 3).
edge(a107, b104, 1).
edge(b104, c106, 4).
edge(b104, d103, 3).
edge(d103, a103, 3).
edge(a103, d104, 6).
edge(d104, d103, 1).
edge(a103, c102, 5).
edge(c102, d104, 1).
edge(c102, c101, 5).
edge(c101, d102, 3).
edge(d103, d102, 6).
edge(d105, c101, 9).










ligacel(X, Y, Custo) :- edge(X, Y, Custo).


aStar(Orig,Dest,Cam,Custo):-
aStar2(Dest,[(_,0,[Orig])],Cam,Custo).
aStar2(Dest,[(_,Custo,[Dest|T])|_],Cam,Custo):-
reverse([Dest|T],Cam).
aStar2(Dest,[(_,Ca,LA)|Outros],Cam,Custo):-
LA=[Act|_],
findall((CEX,CaX,[X|LA]),
(Dest\==Act,edge(Act,X,CustoX),\+ member(X,LA),CaX is CustoX + Ca, estimativa(X,Dest,EstX),CEX is CaX +EstX),Novos),
append(Outros,Novos,Todos),
sort(Todos,TodosOrd),
aStar2(Dest,TodosOrd,Cam,Custo).


estimativa(Nodo1,Nodo2,Estimativa):-
node(Nodo1,X1,Y1),
node(Nodo2,X2,Y2),
Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).




%?- aStar(d105, d106, Caminho, Custo).
%Caminho = [d105, c101, d102, d101, d107, d106],
%Custo = 49 