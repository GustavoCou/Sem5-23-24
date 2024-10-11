 :- discontiguous tempo_ate_fim/2.
 :- discontiguous tempo_desde_inicio/2.

% tarefa(Id, TempoProcessamento).
tarefa(t1, 4).
tarefa(t2, 2).
tarefa(t3, 3).
%tarefa(t4, 8).
%tarefa(t5, 4).
%tarefa(t6, 5).
%tarefa(t7, 9).
%tarefa(t8, 10).
%tarefa(t9, 11).
%tarefa(t10, 22).



tempo_deslocamento(t1, t2, 3).
tempo_deslocamento(t1, t3, 5).
tempo_deslocamento(t1, t4, 5).
tempo_deslocamento(t1, t5, 4).
tempo_deslocamento(t1, t6, 6).
tempo_deslocamento(t1, t7, 2).
tempo_deslocamento(t1, t8, 3).
tempo_deslocamento(t1, t9, 4).
tempo_deslocamento(t1, t10, 5).


tempo_deslocamento(t2, t1, 2).
tempo_deslocamento(t2, t3, 2).
tempo_deslocamento(t2, t4, 2).
tempo_deslocamento(t2, t5, 2).
tempo_deslocamento(t2, t6, 2).
tempo_deslocamento(t2, t7, 2).
tempo_deslocamento(t2, t8, 2).
tempo_deslocamento(t2, t9, 2).
tempo_deslocamento(t2, t10, 2).

tempo_deslocamento(t3, t1, 2).
tempo_deslocamento(t3, t2, 2).
tempo_deslocamento(t3, t4, 5).
tempo_deslocamento(t3, t5, 2).
tempo_deslocamento(t3, t6, 2).
tempo_deslocamento(t3, t7, 3).
tempo_deslocamento(t3, t8, 2).
tempo_deslocamento(t3, t9, 9).
tempo_deslocamento(t3, t10, 2).

%tempo_deslocamento(t4, t1, 2).
%tempo_deslocamento(t4, t2, 2).
%tempo_deslocamento(t4, t3, 5).
%tempo_deslocamento(t4, t5, 2).
%tempo_deslocamento(t4, t6, 2).
%tempo_deslocamento(t4, t7, 3).
%tempo_deslocamento(t4, t8, 2).
%tempo_deslocamento(t4, t9, 9).
%tempo_deslocamento(t4, t10, 2).

%tempo_deslocamento(t5, t1, 2).
%tempo_deslocamento(t5, t2, 2).
%tempo_deslocamento(t5, t4, 5).
%tempo_deslocamento(t5, t3, 2).
%tempo_deslocamento(t5, t6, 2).
%tempo_deslocamento(t5, t7, 3).
%tempo_deslocamento(t5, t8, 2).
%tempo_deslocamento(t5, t9, 9).
%tempo_deslocamento(t5, t10, 2).

%tempo_deslocamento(t6, t1, 2).
%tempo_deslocamento(t6, t2, 2).
%tempo_deslocamento(t6, t4, 5).
%tempo_deslocamento(t6, t3, 2).
%tempo_deslocamento(t6, t5, 2).
%tempo_deslocamento(t6, t7, 3).
%tempo_deslocamento(t6, t8, 2).
%tempo_deslocamento(t6, t9, 9).
%tempo_deslocamento(t6, t10, 2).

%tempo_deslocamento(t7, t1, 20).
%tempo_deslocamento(t7, t2, 21).
%tempo_deslocamento(t7, t4, 3).
%tempo_deslocamento(t7, t3, 5).
%tempo_deslocamento(t7, t5, 6).
%tempo_deslocamento(t7, t6, 1).
%tempo_deslocamento(t7, t8, 7).
%tempo_deslocamento(t7, t9, 10).
%tempo_deslocamento(t7, t10, 6).

%tempo_deslocamento(t8, t1, 20).
%tempo_deslocamento(t8, t2, 21).
%tempo_deslocamento(t8, t4, 3).
%tempo_deslocamento(t8, t3, 5).
%tempo_deslocamento(t8, t5, 6).
%tempo_deslocamento(t8, t6, 1).
%tempo_deslocamento(t8, t7, 7).
%tempo_deslocamento(t8, t9, 10).
%tempo_deslocamento(t8, t10, 6).

%tempo_deslocamento(t9, t1, 20).
%tempo_deslocamento(t9, t2, 21).
%tempo_deslocamento(t9, t4, 31).
%tempo_deslocamento(t9, t3, 21).
%tempo_deslocamento(t9, t5, 34).
%tempo_deslocamento(t9, t6, 15).
%tempo_deslocamento(t9, t7, 29).
%tempo_deslocamento(t9, t8, 10).
%tempo_deslocamento(t9, t10, 6).

%tempo_deslocamento(t10, t1, 20).
%tempo_deslocamento(t10, t2, 21).
%tempo_deslocamento(t10, t4, 31).
%tempo_deslocamento(t10, t3, 21).
%tempo_deslocamento(t10, t5, 34).
%tempo_deslocamento(t10, t6, 15).
%tempo_deslocamento(t10, t7, 29).
%tempo_deslocamento(t10, t8, 10).
%tempo_deslocamento(t10, t9, 6).


%tempo_inicio_e_fim
tempo_desde_inicio(t1, 5).  
tempo_ate_fim(t1, 3).  
tempo_desde_inicio(t2, 4).  
tempo_ate_fim(t2, 2).  
tempo_desde_inicio(t3, 6).  
tempo_ate_fim(t3, 4).  
 
%tempo_desde_inicio(t4, 5).  
%tempo_ate_fim(t4, 3).     
%tempo_desde_inicio(t5, 5).  
%tempo_ate_fim(t5, 3).  
%tempo_desde_inicio(t6, 7).  
%tempo_ate_fim(t6, 7).  
%tempo_desde_inicio(t7, 2).  
%tempo_ate_fim(t7, 3).  
%tempo_desde_inicio(t8, 1).  
%tempo_ate_fim(t8, 2).  
%tempo_desde_inicio(t9, 3).  
%tempo_ate_fim(t9, 3).
%tempo_desde_inicio(t10, 2).  
%tempo_ate_fim(t10, 2).  



% tarefas(NTarefas).
tarefas(3). 

encontrar_melhor_solucao(MelhorSolucao, MenorCusto) :-
statistics(walltime, [TimeSinceStart | _]),
    findall(Tarefas, permutacao_de_tarefas(Tarefas), TodasPermutacoes),
    avaliar_permutacoes(TodasPermutacoes, [], MelhorSolucao, MenorCusto),
statistics(walltime, [NewTimeSinceStart | _]),
    TempoExecucao is NewTimeSinceStart - TimeSinceStart,
    format('Tempo de execucao: ~w ms~n', [TempoExecucao]).

permutacao_de_tarefas(Permutacao) :-
    findall(Tarefa, tarefa(Tarefa, _), ListaTarefas),
    %writeln('Lista de Tarefas: '), writeln(ListaTarefas),  
    permutation(ListaTarefas, Permutacao).
    %writeln('Permutacao: '), writeln(Permutacao). 

	avaliar_permutacoes([], MelhorAtual, MelhorAtual, MenorCusto).

avaliar_permutacoes([Permutacao|Resto], MelhorAtual, MelhorSolucao, MenorCusto) :-
    avalia(Permutacao, Custo),
    (
        (MelhorAtual == [], !, MelhorProx = Permutacao, MenorCustoProx = Custo);
        (MenorCustoAtual = MenorCusto, 
         (Custo < MenorCustoAtual, !, MelhorProx = Permutacao, MenorCustoProx = Custo;
          MelhorProx = MelhorAtual, MenorCustoProx = MenorCustoAtual)
        )
    ),
    avaliar_permutacoes(Resto, MelhorProx, MelhorSolucao, MenorCustoProx).

avalia([PrimeiraTarefa | RestoDasTarefas], CustoTotal) :-
    tempo_desde_inicio(PrimeiraTarefa, TempoInicio),
   % writeln('A ordem de tarefas: '), writeln([PrimeiraTarefa | RestoDasTarefas]), 
    avalia_intermediaria([PrimeiraTarefa | RestoDasTarefas], CustoIntermediario),
    last(RestoDasTarefas, UltimaTarefa),
    tempo_ate_fim(UltimaTarefa, TempoFim),
    CustoTotal is TempoInicio + CustoIntermediario + TempoFim.
    % writeln('Tem o custo Total de: '), writeln(CustoTotal).  


avalia_intermediaria([_], 0).
avalia_intermediaria([Tarefa1, Tarefa2 | Resto], CustoTotal) :-
    (tempo_deslocamento(Tarefa1, Tarefa2, Custo) -> true; Custo = 0),
    avalia_intermediaria([Tarefa2 | Resto], CustoResto),
    CustoTotal is Custo + CustoResto.