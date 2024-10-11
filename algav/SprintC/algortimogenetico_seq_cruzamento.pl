%Evitar que a sequência de cruzamentos se dê sempreentre 1º e 2º elementos da população,
%depois entre 3ºe 4º , 5º e 6º
%Manteve-se o melhoramento do algoritmo com o calculo do melhor indivio, ao acrescentar a funcao de cruzamento que baralha de uma forma random a populacao antes de fazer o cruzamento

%consult("algoritmogenetico_seq_cruzamento.pl").

:-dynamic geracoes/1.
:-dynamic populacao/1.
:-dynamic prob_cruzamento/1.
:-dynamic prob_mutacao/1.

% tarefa(Id,TempoProcessamento,TempConc,PesoPenalizacao).
tarefa(t1,2,5,1).
tarefa(t2,4,7,6).
tarefa(t3,1,11,2).
tarefa(t4,3,9,3).
tarefa(t5,3,8,2).

% tarefas(NTarefas).
tarefas(5).

% parameterizacao
inicializa:-write('Numero de novas Geracoes: '),read(NG), (retract(geracoes(_));true), asserta(geracoes(NG)),
    write('Dimensao da Populacao: '),read(DP),
    (retract(populacao(_));true), asserta(populacao(DP)),
    write('Probabilidade de Cruzamento (%):'), read(P1),
    PC is P1/100, 
    (retract(prob_cruzamento(_));true), asserta(prob_cruzamento(PC)),
    write('Probabilidade de Mutacao (%):'), read(P2),
    PM is P2/100, 
    (retract(prob_mutacao(_));true), asserta(prob_mutacao(PM)).

gera:-
    inicializa,
    gera_populacao(Pop),
    write('Pop='),write(Pop),nl,
    avalia_populacao(Pop,PopAv),
    write('PopAv='),write(PopAv),nl,
    ordena_populacao(PopAv,PopOrd),
    geracoes(NG),
    gera_geracao(0,NG,PopOrd).

    gera_populacao(Pop):-
	populacao(TamPop),
	tarefas(NumT),
	findall(Tarefa,tarefa(Tarefa,_,_,_),ListaTarefas),
	gera_populacao(TamPop,ListaTarefas,NumT,Pop).

gera_populacao(0,_,_,[]):-!.

gera_populacao(TamPop,ListaTarefas,NumT,[Ind|Resto]):-
	TamPop1 is TamPop-1,
	gera_populacao(TamPop1,ListaTarefas,NumT,Resto),
	gera_individuo(ListaTarefas,NumT,Ind),
	not(member(Ind,Resto)).
gera_populacao(TamPop,ListaTarefas,NumT,L):-
	gera_populacao(TamPop,ListaTarefas,NumT,L).

gera_individuo([G],1,[G]):-!.

gera_individuo(ListaTarefas,NumT,[G|Resto]):-
	NumTemp is NumT + 1, % To use with random
	random(1,NumTemp,N),
	retira(N,ListaTarefas,G,NovaLista),
	NumT1 is NumT-1,
	gera_individuo(NovaLista,NumT1,Resto).

retira(1,[G|Resto],G,Resto).
retira(N,[G1|Resto],G,[G1|Resto1]):-
	N1 is N-1,
	retira(N1,Resto,G,Resto1).

avalia_populacao([],[]).
avalia_populacao([Ind|Resto],[Ind*V|Resto1]):-
	avalia(Ind,V),
	avalia_populacao(Resto,Resto1).

avalia(Seq,V):-
	avalia(Seq,0,V).

avalia([],_,0).
avalia([T|Resto],Inst,V):-
	tarefa(T,Dur,Prazo,Pen),
	InstFim is Inst+Dur,
	avalia(Resto,InstFim,VResto),
	(
		(InstFim =< Prazo,!, VT is 0)
  ;
		(VT is (InstFim-Prazo)*Pen)
	),
	V is VT+VResto.


ordena_populacao(PopAv,PopAvOrd):-
	bsort(PopAv,PopAvOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
	bsort(Xs,Zs),
	btroca([X|Zs],Ys).


btroca([X],[X]):-!.

btroca([X*VX,Y*VY|L1],[Y*VY|L2]):-
	VX>VY,!,
	btroca([X*VX|L1],L2).

btroca([X|L1],[X|L2]):-btroca(L1,L2).


gera_geracao(G,G,Pop):-
    write('Geracao '), write(G), write(':'), nl, write(Pop), nl.

gera_geracao(N,G,Pop):-
    write('Geracao '), write(N), write(':'), nl, write(Pop), nl,
    calcula_melhor_individuo(Pop, MelhorAtual),  % Calcula o melhor indivíduo da população atual
    cruzamento(Pop,NPop1),
    mutacao(NPop1,NPop),
    avalia_populacao(NPop,NPopAv),
    ordena_populacao(NPopAv,NPopOrd),
    substituir_pior_pelo_melhor(NPopOrd,MelhorAtual,NPopOrdAtualizado), % Substitui o pior indivíduo pelo melhor atual, se for o caso
    N1 is N+1,
    gera_geracao(N1,G,NPopOrdAtualizado).

    % Cruzamento da populacao 
cruzamento(Pop, NPop) :-
    random_permutation(Pop, PopShuffled),
    cruzamento_pairs(PopShuffled, NPop).

cruzamento_pairs([], []).
cruzamento_pairs([Ind], [Ind]).
cruzamento_pairs([Ind1*_, Ind2*_|Resto], [NInd1, NInd2|Resto1]) :-
gerar_pontos_cruzamento(P1,P2),
	prob_cruzamento(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cruzar(Ind1,Ind2,P1,P2,NInd1),
	  cruzar(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	cruzamento(Resto,Resto1).



calcula_melhor_individuo([Ind*V|Resto], Melhor):-
    calcula_melhor_individuo(Resto, Ind*V, Melhor).

calcula_melhor_individuo([], Melhor, Melhor).

calcula_melhor_individuo([Ind*V|Resto], MelhorAtual, Melhor):-
    (MelhorAtual = _*MelhorValorAtual ->
        (V < MelhorValorAtual ->
            calcula_melhor_individuo(Resto, Ind*V, Melhor);
            calcula_melhor_individuo(Resto, MelhorAtual, Melhor)
        );
        calcula_melhor_individuo(Resto, Ind*V, Melhor)
    ).

substituir_pior_pelo_melhor([_|Resto], Melhor, [Melhor|Resto]).


gerar_pontos_cruzamento(P1,P2):-
	gerar_pontos_cruzamento1(P1,P2).

gerar_pontos_cruzamento1(P1,P2):-
	tarefas(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);(P1=P21,P2=P11)).
gerar_pontos_cruzamento1(P1,P2):-
	gerar_pontos_cruzamento1(P1,P2).




preencheh([],[]).

preencheh([_|R1],[h|R2]):-
	preencheh(R1,R2).


sublista(L1,I1,I2,L):-
	I1 < I2,!,
	sublista1(L1,I1,I2,L).

sublista(L1,I1,I2,L):-
	sublista1(L1,I2,I1,L).

sublista1([X|R1],1,1,[X|H]):-!,
	preencheh(R1,H).

sublista1([X|R1],1,N2,[X|R2]):-!,
	N3 is N2 - 1,
	sublista1(R1,1,N3,R2).

sublista1([_|R1],N1,N2,[h|R2]):-
	N3 is N1 - 1,
	N4 is N2 - 1,
	sublista1(R1,N3,N4,R2).

rotate_right(L,K,L1):-
	tarefas(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):-
	N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).


elimina([],_,[]):-!.

elimina([X|R1],L,[X|R2]):-
	not(member(X,L)),!,
	elimina(R1,L,R2).

elimina([_|R1],L,R2):-
	elimina(R1,L,R2).

insere([],L,_,L):-!.
insere([X|R],L,N,L2):-
	tarefas(T),
	((N>T,!,N1 is N mod T);N1 = N),
	insere1(X,N1,L,L1),
	N2 is N + 1,
	insere(R,L1,N2,L2).


insere1(X,1,L,[X|L]):-!.
insere1(X,N,[Y|L],[Y|L1]):-
	N1 is N-1,
	insere1(X,N1,L,L1).

cruzar(Ind1,Ind2,P1,P2,NInd11):-
	sublista(Ind1,P1,P2,Sub1),
	tarefas(NumT),
	R is NumT-P2,
	rotate_right(Ind2,R,Ind21),
	elimina(Ind21,Sub1,Sub2),
	P3 is P2 + 1,
	insere(Sub2,Sub1,P3,NInd1),
	eliminah(NInd1,NInd11).


eliminah([],[]).

eliminah([h|R1],R2):-!,
	eliminah(R1,R2).

eliminah([X|R1],[X|R2]):-
	eliminah(R1,R2).

mutacao([],[]).
mutacao([Ind|Rest],[NInd|Rest1]):-
	prob_mutacao(Pmut),
	random(0.0,1.0,Pm),
	((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
	mutacao(Rest,Rest1).

mutacao1(Ind,NInd):-
	gerar_pontos_cruzamento(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).

/*
Numero de novas Geracoes: 6.
Dimensao da Populacao: |: 8.
Probabilidade de Cruzamento (%):|: 50.
Probabilidade de Mutacao (%):|: 25.
Pop=[[t3,t2,t4,t1,t5],[t5,t3,t1,t4,t2],[t5,t4,t3,t2,t1],[t4,t3,t2,t1,t5],[t1,t2,t5,t4,t3],[t3,t2,t5,t1,t4],[t4,t1,t3,t2,t5],[t2,t1,t4,t5,t3]]
PopAv=[[t3,t2,t4,t1,t5]*15,[t5,t3,t1,t4,t2]*37,[t5,t4,t3,t2,t1]*32,[t4,t3,t2,t1,t5]*21,[t1,t2,t5,t4,t3]*15,[t3,t2,t5,t1,t4]*17,[t4,t1,t3,t2,t5]*28,[t2,t1,t4,t5,t3]*13]
Geracao 0:
[[t2,t1,t4,t5,t3]*13,[t3,t2,t4,t1,t5]*15,[t1,t2,t5,t4,t3]*15,[t3,t2,t5,t1,t4]*17,[t4,t3,t2,t1,t5]*21,[t4,t1,t3,t2,t5]*28,[t5,t4,t3,t2,t1]*32,[t5,t3,t1,t4,t2]*37]
Geracao 1:
[[t2,t1,t4,t5,t3]*13,[t2,t4,t1,t5,t3]*16,[t2,t3,t5,t1,t4]*17,[t4,t3,t2,t1,t5]*21,[t4,t1,t3,t2,t5]*28,[t3,t4,t5,t2,t1]*32,[t5,t3,t1,t4,t2]*37,[t4,t3,t5,t1,t2]*40]
Geracao 2:
[[t2,t1,t4,t5,t3]*13,[t2,t4,t1,t5,t3]*16,[t2,t3,t1,t5,t4]*18,[t3,t4,t2,t1,t5]*21,[t4,t1,t3,t2,t5]*28,[t3,t4,t5,t2,t1]*32,[t3,t5,t1,t4,t2]*37,[t4,t3,t5,t1,t2]*40]
Geracao 3:
[[t2,t1,t4,t5,t3]*13,[t2,t4,t1,t5,t3]*16,[t2,t3,t1,t5,t4]*18,[t3,t4,t2,t1,t5]*21,[t4,t1,t3,t2,t5]*28,[t1,t4,t5,t2,t3]*34,[t4,t5,t1,t2,t3]*37,[t4,t3,t5,t1,t2]*40]
Geracao 4:
[[t2,t1,t4,t5,t3]*13,[t4,t2,t1,t5,t3]*16,[t2,t3,t1,t5,t4]*18,[t3,t5,t2,t1,t4]*23,[t4,t1,t2,t5,t3]*24,[t4,t3,t1,t2,t5]*29,[t3,t1,t5,t2,t4]*30,[t4,t5,t1,t2,t3]*37]
Geracao 5:
[[t2,t1,t4,t5,t3]*13,[t5,t2,t1,t4,t3]*17,[t2,t3,t1,t5,t4]*18,[t3,t5,t2,t1,t4]*23,[t4,t1,t2,t5,t3]*24,[t4,t3,t1,t2,t5]*29,[t1,t3,t5,t2,t4]*30,[t4,t5,t1,t2,t3]*37]
Geracao 6:
[[t2,t1,t4,t5,t3]*13,[t2,t5,t1,t4,t3]*17,[t5,t2,t1,t4,t3]*17,[t2,t1,t3,t5,t4]*17,[t3,t5,t2,t1,t4]*23,[t4,t1,t2,t5,t3]*24,[t4,t3,t1,t2,t5]*29,[t1,t3,t5,t2,t4]*30]
true .
*/


/*
Numero de novas Geracoes: 6
|: .
Dimensao da Populacao: |: 8.
Probabilidade de Cruzamento (%):|: 50.
Probabilidade de Mutacao (%):|: 25.
Pop=[[t3,t5,t2,t4,t1],[t2,t4,t1,t5,t3],[t5,t1,t3,t2,t4],[t1,t2,t3,t5,t4],[t5,t3,t4,t1,t2],[t2,t1,t3,t5,t4],[t2,t3,t1,t5,t4],[t4,t1,t2,t5,t3]]
PopAv=[[t3,t5,t2,t4,t1]*20,[t2,t4,t1,t5,t3]*16,[t5,t1,t3,t2,t4]*30,[t1,t2,t3,t5,t4]*16,[t5,t3,t4,t1,t2]*40,[t2,t1,t3,t5,t4]*17,[t2,t3,t1,t5,t4]*18,[t4,t1,t2,t5,t3]*24]
Geracao 0:
[[t2,t4,t1,t5,t3]*16,[t1,t2,t3,t5,t4]*16,[t2,t1,t3,t5,t4]*17,[t2,t3,t1,t5,t4]*18,[t3,t5,t2,t4,t1]*20,[t4,t1,t2,t5,t3]*24,[t5,t1,t3,t2,t4]*30,[t5,t3,t4,t1,t2]*40]
Geracao 1:
[[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t1,t2,t3,t5,t4]*16,[t2,t3,t1,t5,t4]*18,[t3,t5,t2,t4,t1]*20,[t4,t1,t2,t5,t3]*24,[t5,t1,t3,t2,t4]*30,[t5,t3,t4,t2,t1]*32]
Geracao 2:
[[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t2,t3,t1,t5,t4]*18,[t3,t5,t2,t4,t1]*20,[t4,t1,t2,t5,t3]*24,[t1,t3,t4,t2,t5]*28,[t4,t1,t3,t2,t5]*28]
Geracao 3:
[[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t2,t3,t1,t5,t4]*18,[t4,t1,t2,t5,t3]*24,[t1,t5,t2,t4,t3]*25,[t4,t1,t3,t2,t5]*28,[t1,t3,t4,t2,t5]*28]
Geracao 4:
[[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t1,t5,t2,t4,t3]*25,[t5,t1,t2,t4,t3]*25,[t4,t1,t3,t2,t5]*28,[t1,t3,t4,t2,t5]*28,[t5,t4,t1,t2,t3]*37]
Geracao 5:
[[t2,t4,t1,t5,t3]*16,[t2,t4,t1,t5,t3]*16,[t5,t1,t2,t4,t3]*25,[t1,t5,t2,t4,t3]*25,[t1,t3,t4,t2,t5]*28,[t4,t1,t3,t2,t5]*28,[t5,t4,t1,t2,t3]*37,[t4,t5,t1,t2,t3]*37]
Geracao 6:
[[t2,t4,t1,t5,t3]*16,[t1,t2,t5,t4,t3]*15,[t2,t4,t1,t5,t3]*16,[t5,t1,t2,t4,t3]*25,[t1,t4,t3,t2,t5]*28,[t1,t5,t3,t2,t4]*30,[t3,t5,t1,t2,t4]*31,[t4,t5,t1,t2,t3]*37]
true .*/