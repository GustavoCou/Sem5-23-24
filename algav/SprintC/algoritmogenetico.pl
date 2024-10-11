%consult("algoritmogenetico.pl").

%Contem pontos de melhoramento 1, 2, 3 e 4.

% tarefa(Id,TempoProcessamento,TempConc,PesoPenalizacao).
tarefa(t1,2,5,1).
tarefa(t2,4,7,6).
tarefa(t3,1,11,2).
tarefa(t4,3,9,3).
tarefa(t5,3,8,2).

% tarefas(NTarefas).
tarefas(5).

% parameterizacao
inicializa:-write('Numero de novas Geracoes: '),read(NG),
	(retract(geracoes(_));true), asserta(geracoes(NG)),
	write('Dimensao da Populacao: '),read(DP),
	(retract(populacao(_));true), asserta(populacao(DP)),
	write('Probabilidade de Cruzamento(percentagem): '), read(P1),
	PC is P1/100, 
	(retract(prob_cruzamento(_));true), 	asserta(prob_cruzamento(PC)),
	write('Probabilidade de Mutacao(percentagem): '), read(P2),
	PM is P2/100, 
    (retract(prob_mutacao(_));true), asserta(prob_mutacao(PM)),
    write('Tempo Solucao(segundos): '), read(TempS),
    (retract(tempo_solucao(_));true), asserta(tempo_solucao(TempS)),
    write('Avaliacao Otima:'), read(AO),
    (retract(avaliacao_otima(_));true), asserta(avaliacao_otima(AO)),
    write('Restricao de Estabilizacao:'), read(RE),
    (retract(restricaoEstabilizacao(_));true), asserta(restricaoEstabilizacao(RE)),
	(retract(estabilizacao_atual(_));true), asserta(estabilizacao_atual(0)),
	PMelhor is (DP*30)/100, 
	ceiling(PMelhor,PMelhor1),
	(retract(p_melhores(_));true), asserta(p_melhores(PMelhor1)).

gera:-
	inicializa,
	gera_populacao(Pop),
	write('Pop='),write(Pop),nl,
	avalia_populacao(Pop,PopAv),
	write('PopAv='),write(PopAv),nl,
	ordena_populacao(PopAv,PopOrd),
    geracoes(NG),
    get_time(Tempi),
    (retract(tempo_inicial(_));true), asserta(tempo_inicial(Tempi)),
	gera_geracao(0,NG,PopOrd,ResultPop),
	write('FinalPop='),write(ResultPop),nl.

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


gera_geracao(G,G,Pop,Pop):-!,
	write('Geracao '), write(G), write(':'), nl, write(Pop), nl.

gera_geracao(N,G,Pop,ResultPop):-
    tempo_inicial(Tempi),
    get_time(Tempf),
    tempo_solucao(TempS),
    estabilizacao_atual(EA),
	restricaoEstabilizacao(RE),
	write('Geracao '), write(N), write(':'), nl, write(Pop), nl,
    (
    ((Tempf-Tempi)>=TempS,!,ResultPop=Pop);
    ((EA >= RE,!,ResultPop=Pop));
    (Pop=[_*MenorValor|_],
    avaliacao_otima(AO),
    ((MenorValor=<AO,!,ResultPop=Pop);
    (random_permutation(Pop,PopPermuted),%nl,write('LRP='),write(PopPermuted),nl,
	cruzamento(PopPermuted,NPop1),
	mutacao(NPop1,NPop),
	avalia_populacao(NPop,NPopAv),
	append(NPopAv, Pop, NPopAv1),
	eliminaRepetidos(NPopAv1,NPopAv2),
	ordena_populacao(NPopAv2,NPopOrd),
	p_melhores(PMelhor),
	selecionaElem(NPopOrd,PopProxGer,PopResto, PMelhor),
	avalia_random(PopResto,PopRestoAv),
	ordena_populacao(PopRestoAv,PopRestoOrd),
	populacao(DP),
	PResto is DP-PMelhor,
	selecionaElem(PopRestoOrd,PopRestoSelected,_, PResto),
	refazAvaliacaoRand(PopRestoSelected,PopResto,PopRestoProxGer),
	ordena_populacao(PopRestoProxGer,PopRestoProxGerOrd),
	append(PopProxGer,PopRestoProxGerOrd,PopFinal),
	N1 is N+1,
	incg_estabilizacao(EA,PopFinal,Pop),
    gera_geracao(N1,G,PopFinal,ResultPop))
	))).

selecionaElem([H|Resto],[H],Resto, 1):-!.
selecionaElem([H],[H],[], _):-!.
selecionaElem([H|NPopOrd],[H|N1PopOrd],Resto, PAtual):- PAtual1 is PAtual - 1, selecionaElem(NPopOrd,N1PopOrd,Resto,PAtual1).

avalia_random([H*Av],[H*AvR]):-random(0.0,1.0,R),
							   AvR is Av*R.
avalia_random([H*Av|PopResto],[H*AvR|PopRestoAV]):-random(0.0,1.0,R),
												   AvR is Av*R,
												   avalia_random(PopResto, PopRestoAV).

refazAvaliacaoRand([H*_],PopResto,[H*AvR]):-member(H*AvR,PopResto),!.
refazAvaliacaoRand([H*_|PopRestoSelected],PopResto,[H*AvR|PopRestoProxGer]):-member(H*AvR,PopResto),!,refazAvaliacaoRand(PopRestoSelected,PopResto,PopRestoProxGer).	
refazAvaliacaoRand([_|PopRestoSelected],PopResto,PopRestoProxGer):-refazAvaliacaoRand(PopRestoSelected,PopResto,PopRestoProxGer).						


incg_estabilizacao(EA,NPopOrd,Pop):-((NPopOrd == Pop, !, EA1 is EA+1);(EA1 is 0)),
								(retract(estabilizacao_atual(_));true), asserta(estabilizacao_atual(EA1)).

eliminaRepetidos([H],[H]):-!.
eliminaRepetidos([H|N1PopOrd],[H|N2PopOrd]):-not(member(H,N1PopOrd)),!,eliminaRepetidos(N1PopOrd,N2PopOrd).
eliminaRepetidos([_|N1PopOrd],N2PopOrd):-eliminaRepetidos(N1PopOrd,N2PopOrd).



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


cruzamento([],[]).
cruzamento([Ind*_],[Ind]).
cruzamento([Ind1*_,Ind2*_|Resto],[NInd1,NInd2|Resto1]):-
	gerar_pontos_cruzamento(P1,P2),
	prob_cruzamento(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cruzar(Ind1,Ind2,P1,P2,NInd1),
	  cruzar(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	cruzamento(Resto,Resto1).

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

rotate_left(L,K,L1):-
	rl(K,L,L1).

rl(0,L,L):-!.

rl(N,[X|R],R2):-
	N1 is N - 1,
	append(R,[X],R1),
	rl(N1,R1,R2).


elimina([],_,[]):-!.

elimina([X|R1],L,[X|R2]):-
	not(member(X,L)),!,
	elimina(R1,L,R2).

elimina([_|R1],L,R2):-
	elimina(R1,L,R2).

cruzar(Ind1,Ind2,P1,P2,NInd11):-
	sublista(Ind1,P1,P2,Sub1),
	tarefas(NumT),
	R is NumT-P2,
	rotate_right(Ind2,R,Ind21),
	elimina(Ind21,Sub1,Sub2),
    append(Sub2,Sub1,Sub3),
    rotate_left(Sub3,R,NInd1),
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
Melhoramento 2
Permutação aleatória entre os elementos da lista de indivíduos da população:
?- random_permutation([[t2,t5,t4,t3,t1]*11,[t2,t1,t4,t5,t3]*13,[t2,t4,t3,t5,t1]*14,[t2,t5,t3,t4,t1]*14,[t2,t3,t4,t1,t5]*15,[t2,t1,t5,t4,t3]*16,[t4,t3,t1,t2,t5]*29,[t1,t4,t5,t2,t3]*34],LRP),nl,write('LRP='),write(LRP),nl.

LRP=[[t4,t3,t1,t2,t5]*29,[t2,t3,t4,t1,t5]*15,[t2,t5,t3,t4,t1]*14,[t2,t1,t4,t5,t3]*13,[t2,t4,t3,t5,t1]*14,[t2,t1,t5,t4,t3]*16,[t1,t4,t5,t2,t3]*34,[t2,t5,t4,t3,t1]*11]
LRP = [[t4, t3, t1, t2, t5]*29, [t2, t3, t4, t1, t5]*15, [t2, t5, t3, t4, t1]*14, [t2, t1, t4, t5|...]*13, [t2, t4, t3|...]*14, [t2, t1|...]*16, [t1|...]*34, [...|...]*11].
*/

/*
Melhoramento 1,2,3 e 4.
Numero de novas Geracoes: 6. 
Dimensao da Populacao: 8.
Probabilidade de Cruzamento(percentagem): 50.
Probabilidade de Mutacao(percentagem): 25.
Tempo Solucao(segundos): 15.
Avaliacao Otima: 3260.
Restricao de Estabilizacao: 3.

Pop=[[t1,t5,t3,t4,t2],[t2,t1,t3,t4,t5],[t2,t3,t1,t5,t4],[t5,t4,t1,t3,t2],[t2,t4,t3,t5,t1],[t5,t4,t3,t1,t2],[t5,t1,t2,t3,t4],[t4,t1,t5,t2,t3]]
PopAv=[[t1,t5,t3,t4,t2]*36,[t2,t1,t3,t4,t5]*14,[t2,t3,t1,t5,t4]*18,[t5,t4,t1,t3,t2]*39,[t2,t4,t3,t5,t1]*14,[t5,t4,t3,t1,t2]*40,[t5,t1,t2,t3,t4]*24,[t4,t1,t5,t2,t3]*34]
Geracao 0:
[[t2,t1,t3,t4,t5]*14,[t2,t4,t3,t5,t1]*14,[t2,t3,t1,t5,t4]*18,[t5,t1,t2,t3,t4]*24,[t4,t1,t5,t2,t3]*34,[t1,t5,t3,t4,t2]*36,[t5,t4,t1,t3,t2]*39,[t5,t4,t3,t1,t2]*40]
FinalPop=[[t2,t1,t3,t4,t5]*14,[t2,t4,t3,t5,t1]*14,[t2,t3,t1,t5,t4]*18,[t5,t1,t2,t3,t4]*24,[t4,t1,t5,t2,t3]*34,[t1,t5,t3,t4,t2]*36,[t5,t4,t1,t3,t2]*39,[t5,t4,t3,t1,t2]*40]
*/














