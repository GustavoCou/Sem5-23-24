:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).


% Definindo o manipulador HTTP
:- http_handler(root(find), find_handler, []).


% Manipulador da requisição HTTP
find_handler(_Request) :-
cors_enable,
format('Access-Control-Allow-Origin: *\n'),
encontrar_melhor_solucao(MelhorSolucao, MenorCusto),
reply_json(json{solution: MelhorSolucao, custo: MenorCusto}).



% Iniciar servidor
start_server(Port) :-
    http_server(http_dispatch, [port(Port)]).



 :- discontiguous tempo_ate_fim/2.
 :- discontiguous tempo_desde_inicio/2.

% tarefa(Id, TempoProcessamento).
tarefa(t1, 4).
tarefa(t2, 2).
tarefa(t3, 3).
tarefa(t4, 8).
tarefa(t5, 4).
tarefa(t6, 5).


tempo_deslocamento(t1, t2, 3).
tempo_deslocamento(t1, t3, 5).
tempo_deslocamento(t1, t4, 5).
tempo_deslocamento(t1, t5, 4).
tempo_deslocamento(t1, t6, 6).

tempo_deslocamento(t2, t1, 2).
tempo_deslocamento(t2, t3, 2).
tempo_deslocamento(t2, t4, 2).
tempo_deslocamento(t2, t5, 2).
tempo_deslocamento(t2, t6, 2).

tempo_deslocamento(t3, t1, 2).
tempo_deslocamento(t3, t2, 2).
tempo_deslocamento(t3, t4, 5).
tempo_deslocamento(t3, t5, 2).
tempo_deslocamento(t3, t6, 2).

tempo_deslocamento(t4, t1, 2).
tempo_deslocamento(t4, t2, 2).
tempo_deslocamento(t4, t3, 5).
tempo_deslocamento(t4, t5, 2).
tempo_deslocamento(t4, t6, 2).

tempo_deslocamento(t5, t1, 2).
tempo_deslocamento(t5, t2, 2).
tempo_deslocamento(t5, t4, 5).
tempo_deslocamento(t5, t3, 2).
tempo_deslocamento(t5, t6, 2).

tempo_deslocamento(t6, t1, 2).
tempo_deslocamento(t6, t2, 2).
tempo_deslocamento(t6, t4, 5).
tempo_deslocamento(t6, t3, 2).
tempo_deslocamento(t6, t5, 2).


%tempo_inicio_e_fim
tempo_desde_inicio(t1, 5).  
tempo_ate_fim(t1, 3).  
tempo_desde_inicio(t2, 4).  
tempo_ate_fim(t2, 2).  
tempo_desde_inicio(t3, 6).  
tempo_ate_fim(t3, 4).  
tempo_desde_inicio(t4, 5).  
tempo_ate_fim(t4, 3).     
tempo_desde_inicio(t5, 5).  
tempo_ate_fim(t5, 3).  
tempo_desde_inicio(t6, 7).  
tempo_ate_fim(t6, 7).  
 


% tarefas(NTarefas).
tarefas(6). 

encontrar_melhor_solucao(MelhorSolucao, MenorCustoSolucao) :-
    findall(Tarefas, permutacao_de_tarefas(Tarefas), TodasPermutacoes),
    avaliar_permutacoes(TodasPermutacoes, [], MelhorSolucao, MenorCusto,MenorCustoSolucao).


permutacao_de_tarefas(Permutacao) :-
    findall(Tarefa, tarefa(Tarefa, _), ListaTarefas),  
    permutation(ListaTarefas, Permutacao).

	avaliar_permutacoes([], MelhorAtual, MelhorAtual, MenorCusto,MenorCusto).

avaliar_permutacoes([Permutacao|Resto], MelhorAtual, MelhorSolucao, MenorCusto,MenorCustoSolucao) :-
    avalia(Permutacao, Custo),
    (
        (MelhorAtual == [], !, MelhorProx = Permutacao, MenorCustoProx = Custo);
        (MenorCustoAtual = MenorCusto, 
         (Custo < MenorCustoAtual, !, MelhorProx = Permutacao, MenorCustoProx = Custo;
          MelhorProx = MelhorAtual, MenorCustoProx = MenorCustoAtual)
        )
    ),
    avaliar_permutacoes(Resto, MelhorProx, MelhorSolucao, MenorCustoProx,MenorCustoSolucao).

avalia([PrimeiraTarefa | RestoDasTarefas], CustoTotal) :-
    tempo_desde_inicio(PrimeiraTarefa, TempoInicio),
    avalia_intermediaria([PrimeiraTarefa | RestoDasTarefas], CustoIntermediario),
    last(RestoDasTarefas, UltimaTarefa),
    tempo_ate_fim(UltimaTarefa, TempoFim),
    CustoTotal is TempoInicio + CustoIntermediario + TempoFim.  


avalia_intermediaria([_], 0).
avalia_intermediaria([Tarefa1, Tarefa2 | Resto], CustoTotal) :-
    (tempo_deslocamento(Tarefa1, Tarefa2, Custo) -> true; Custo = 0),
    avalia_intermediaria([Tarefa2 | Resto], CustoResto),
    CustoTotal is Custo + CustoResto.