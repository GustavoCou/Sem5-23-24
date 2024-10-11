:- use_module(library(http/json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_client)).

:- set_setting(http:cors, [*]).

%% Base Conhecimento principal

%:- dynamic carateristicasCam/6. 
:- dynamic idArmazem/2.
:- dynamic carateristicasCam/6.
:- dynamic entrega/6.


% Relação entre pedidos HTTP e predicados que os processam

:- http_handler('/obterMelhorViagem', obterMelhorViagem, []).	
:- http_handler('/menorDistancia', menorDistancia, []).	
:- http_handler('/maiorMassa', maiorMassa, []).	
:- http_handler('/melhorRelacao', melhorRelacao, []).	

obterMelhorViagem(Request):-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    melhorViagem(L,Tempo,Data,Camiao),
    prolog_to_json(L, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).

menorDistancia(Request):-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    melhorViagemArmazemMaisProximo(Data, Camiao, Viagem, Tempo),
    prolog_to_json(Viagem, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).

maiorMassa(Request):-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    melhorViagemArmazemMaisMassa(Data, Camiao, Viagem, Tempo),
    prolog_to_json(Viagem, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).

melhorRelacao(Request):-
    cors_enable,
    format('Access-Control-Allow-Origin: ~w~n', [*]),
    format('Access-Control-Allow-Headers: ~w~n', [*]),
    http_parameters(Request,
                    [ data(Data, []),
                      camiao(Camiao, [])
                    ]),
    melhorViagemMelhorRelacao(Data, Camiao, Viagem, Tempo),
    prolog_to_json(Viagem, JSONObject),
    prolog_to_json(Tempo, JSONObject2),
    reply_json([JSONObject2, JSONObject], [json_object(dict)]).


% ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.
startServer(Port) :-
    http_server(http_dispatch, [port(Port)]),
    importarInformacao().

stopServer:-
    retract(port(Port)),
    http_stop_server(Port,_).

:- initialization(startServer(5050)).

% -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.

importarInformacao():-
    adicionarArmazens(),
    adicionarCamioes(),
    adicionarEntregas().

adicionarArmazens():-
	http_open('https://localhost:5001/api/Armazens', ResultJSON, []),
	json_read_dict(ResultJSON, ResultObj),
	armazensInfo(ResultObj, ResultValue),
	criarArmazensDinamicamente(ResultValue),
	close(ResultJSON).

armazensInfo([],[]).
armazensInfo([H|T],[H.id,H.designacaoArmazem.designacao|L]):-
	armazensInfo(T, L).

criarArmazensDinamicamente([]).
criarArmazensDinamicamente([I,D|L]):-
	assert(idArmazem(I,D)),
	criarArmazensDinamicamente(L).

eliminarArmazens():-
    retract(idArmazem(_,_)),
    fail.

adicionarCamioes():-
	http_open('http://localhost:3000/api/camiao/camioesExistentes', ResultJSON, []),
	json_read_dict(ResultJSON, ResultObj),
	camioesInfo(ResultObj, ResultValue),
	criarCamioesDinamicamente(ResultValue),
	close(ResultJSON).

camioesInfo([],[]).
camioesInfo([H|T],[Designacao,H.tara,H.capacidadeCarga,H.cargaMaximaBaterias,H.autonomia,H.tempoCarregamentoRapido|L]):-
	atom_string(H.designacao, X),
  atom_string(Designacao, X),
	camioesInfo(T, L).

criarCamioesDinamicamente([]).
criarCamioesDinamicamente([D,T,MC,MB,A,CT|L]):-
	write(D),nl,
	assert(carateristicasCam(D,T,MC,MB,A,CT)),
	criarCamioesDinamicamente(L).

eliminarCamioes():-
    retract(carateristicasCam(_,_,_,_,_,_)),
    fail.


adicionarEntregas():-
	http_open('https://localhost:5001/api/Entrega/', ResultJSON, []),
	json_read_dict(ResultJSON, ResultObj),
	entregasInfo(ResultObj, ResultValue),
	criarEntregasDinamicamente(ResultValue),
	close(ResultJSON).

entregasInfo([],[]).
entregasInfo([H|T],[(H.identificadorEntrega, DataEntrega, H.massaEntrega.valor, H.armazemID.value, H.tempoCarga.minutos, H.tempoDescarga.minutos)|L]):-
  atom_number(H.data, X),
  atom_number(DataEntrega, X),
  write(DataEntrega),nl,
	entregasInfo(T, L).

criarEntregasDinamicamente([]).
criarEntregasDinamicamente([(Id,Data,Massa,Armazem,TempoColoc,TempoRet)|L]):-
	assert(entrega(Id,Data,Massa,Armazem,TempoColoc,TempoRet)),
	criarEntregasDinamicamente(L).

eliminarEntregas():-
    retract(entrega(_,_,_,_,_,_)),
    fail.


% -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.

% User Story 1

armazensViagem(L,Data):-findall(Id, entrega(_,Data,_,Id,_,_),L).

viagens(LT,Data):- armazensViagem(LA,Data), findall(Viagem, permutation(LA, Viagem), LT).

viagensFinal(LF,Data):-viagens(LT,Data), viagensCompleta(LT, LF).

viagensCompleta([],[]).
viagensCompleta([T|LT], [R|LF]):- adicionarMatosinhos(T, R), viagensCompleta(LT, LF).

adicionarMatosinhos(LI, LF):-cidadeArmazem(Id), append([Id|LI],[Id],LF).

% User Story 2

obterCargaCamiao(_, [], [], 0):-!.
obterCargaCamiao(Data, [Armazem|LA], [Carga|LC], Carga):-obterCargaCamiao(Data, LA, LC, CargaAux), entrega(_,Data,Massa,Armazem,_,_), Carga is Massa + CargaAux.

adicionarTaraCamiao(NomeCamiao, LC, LCT):- carateristicasCam(NomeCamiao,Tara,_,_,_,_), adicionarTara(Tara,LC,LCT).

adicionarTara(Tara,[],[Tara]):-!.
adicionarTara(Tara, [Carga|LC], [CargaTara|LCT]):- adicionarTara(Tara,LC,LCT), CargaTara is Carga + Tara.

obterCapacidadeCargaComTara(Camiao,Capacidade):-carateristicasCam(Camiao,Tara,CapacidadeCarga,_,_,_), Capacidade is Tara + CapacidadeCarga.

determinarTempo(Data, Camiao, LA, Tempo):- obterCargaCamiao(Data, LA, LC,_), adicionarTaraCamiao(Camiao,LC, LCT),
                                           cidadeArmazem(Id), append([Id|LA],[Id],Viagem),
                                           obterCapacidadeCargaComTara(Camiao,Capacidade),
                                           carateristicasCam(Camiao,_,_,CargaBaterias,_,DuracaoCarregamento),
                                           tempoViagem(Viagem, LCT,Capacidade,CargaBaterias,CargaBaterias,DuracaoCarregamento,Data,Tempo),!.

tempoViagem([A1,A2],[Carga1],Capacidade, CargaBaterias,CargaMaxima,_, _, Tempo):-dadosCam_t_e_ta(_, A1, A2, TempoMaxPercurso, EnergiaMaxGasta, TempoExtra),
                                                                                          TempoPercurso is TempoMaxPercurso*Carga1/Capacidade,
                                                                                          EnergiaPercurso is EnergiaMaxGasta*Carga1/Capacidade,
                                                                                          EnergiaBaterias is CargaBaterias - EnergiaPercurso,
                                                                                          ((EnergiaBaterias<(CargaMaxima*0.2), TempoExtraNecessario is TempoExtra,!);( TempoExtraNecessario is 0)),
                                                                                          Tempo is TempoPercurso + TempoExtraNecessario.


tempoViagem([A1,A2,A3|Viagem], [Carga1,Carga2|LCT],Capacidade, CargaBaterias,CargaMaxima,DuracaoCarregamento, Data, Tempo):-dadosCam_t_e_ta(_, A1, A2, TempoMaxPercurso, EnergiaMaxGasta, TempoExtra),
                                                                       TempoPercurso is TempoMaxPercurso*Carga1/Capacidade,
                                                                       EnergiaPercurso is EnergiaMaxGasta*Carga1/Capacidade,
                                                                       EnergiaBaterias is CargaBaterias - EnergiaPercurso,
                                                                       ((EnergiaBaterias<(CargaMaxima*0.2),EnergiaBateriasChegadaArmazem is (CargaMaxima*0.2), TempoExtraNecessario is TempoExtra,!);(EnergiaBateriasChegadaArmazem is EnergiaBaterias, TempoExtraNecessario is 0)),
                                                                       entrega(_,Data,_,A2,_,TempoDescarregar),
                                                                       dadosCam_t_e_ta(_, A2, A3, _,  EnergiaMaxGastaSeguinte,_),
                                                                       EnergiaNecessariaSeguinte is EnergiaMaxGastaSeguinte * Carga2 / Capacidade,
                                                                       cidadeArmazem(Matosinhos),
                                                                       ((A3 == Matosinhos, EnergiaBateriasChegadaArmazem - EnergiaNecessariaSeguinte < (CargaMaxima*0.2), QuantidadeCarregar is ((CargaMaxima*0.2) - (EnergiaBateriasChegadaArmazem - EnergiaNecessariaSeguinte) ), TempoCarregamento is QuantidadeCarregar*DuracaoCarregamento/(CargaMaxima*0.6),CargaBateriaSeguinte is QuantidadeCarregar+EnergiaBateriasChegadaArmazem,!);(
                                                                       ((EnergiaNecessariaSeguinte>EnergiaBateriasChegadaArmazem,CargaBateriaSeguinte is (CargaMaxima*0.8), TempoCarregamento is ((CargaMaxima*0.8) - EnergiaBateriasChegadaArmazem)*DuracaoCarregamento/(CargaMaxima*0.6),!);((EnergiaBateriasChegadaArmazem-EnergiaNecessariaSeguinte<(CargaMaxima*0.2), CargaBateriaSeguinte is (CargaMaxima*0.8), TempoCarregamento is ((CargaMaxima*0.8) - EnergiaBateriasChegadaArmazem)*DuracaoCarregamento/(CargaMaxima*0.6),!);(CargaBateriaSeguinte is EnergiaBaterias, TempoCarregamento is 0))))),
                                                                       ((TempoCarregamento>TempoDescarregar, TempoEspera is TempoCarregamento,!);( TempoEspera is TempoDescarregar)),
                                                                       tempoViagem([A2,A3|Viagem],[Carga2|LCT], Capacidade, CargaBateriaSeguinte, CargaMaxima ,DuracaoCarregamento, Data, Tempo1),
                                                                       Tempo is Tempo1 + TempoPercurso + TempoExtraNecessario + TempoEspera.


melhorViagem(L,Tempo,Data,Camiao):-(run(Data, Camiao);true),menorTempo(L,Tempo).

run(Data, Camiao):- retractall(menorTempo(_,_)), assertz(menorTempo(_,1000000)),
        findall(Id, entrega(_,Data,_,Id,_,_),LF),
        permutation(LF,LFPerm),
        determinarTempo(Data,Camiao,LFPerm,Tempo),
        atualiza(LFPerm,Tempo),
        fail.

atualiza(LFPerm,Tempo):-
        menorTempo(_,TempoMin),
        ((Tempo<TempoMin,!,retract(menorTempo(_,_)),assertz(menorTempo(LFPerm,Tempo)));true).


% User Story 4

armazemMaisProximo(_, [], 1000000,_):-!. 

armazemMaisProximo(Origem, [A1|Armazens], MenorTempo, Armazem):-armazemMaisProximo(Origem,Armazens,MenorTempo1,Armazem1),
                                                                dadosCam_t_e_ta(_,Origem,A1,Tempo,_,_),
                                                                ((Tempo<MenorTempo1,!, MenorTempo is Tempo, Armazem = A1);MenorTempo is MenorTempo1, Armazem = Armazem1).


bfsArmazemMaisProximo(_,[],[]):-!.

bfsArmazemMaisProximo(Origem,[A|RestantesArmazens],[ArmazemSeguinte|Viagem]):-armazemMaisProximo(Origem,[A|RestantesArmazens],_,ArmazemSeguinte),
                                                                              delete([A|RestantesArmazens],ArmazemSeguinte,ArmazensEmFalta),
                                                                              bfsArmazemMaisProximo(ArmazemSeguinte,ArmazensEmFalta,Viagem).


melhorViagemArmazemMaisProximo(Data, Camiao, Viagem, Tempo):-armazensViagem(ArmazensVisitar,Data),
                                                             cidadeArmazem(Origem),
                                                             bfsArmazemMaisProximo(Origem,ArmazensVisitar,Viagem),
                                                             determinarTempo(Data, Camiao, Viagem, Tempo), !.

entregaMaisMassa([],_, 0,_):-!.

entregaMaisMassa([A1|Armazens], Data, MaiorMassa, Armazem):-entregaMaisMassa(Armazens,Data,MaiorMassa1,Armazem1),
                                                           entrega(_,Data,Massa,A1,_,_),
                                                           ((Massa>MaiorMassa1,!, MaiorMassa is Massa, Armazem = A1);MaiorMassa is MaiorMassa1, Armazem = Armazem1),!.


bfsArmazemMaisMassa(_,[],[]):-!.

bfsArmazemMaisMassa(Data,[A|RestantesArmazens],[ArmazemSeguinte|Viagem]):-entregaMaisMassa([A|RestantesArmazens],Data,_,ArmazemSeguinte),
                                                                              delete([A|RestantesArmazens],ArmazemSeguinte,ArmazensEmFalta),
                                                                              bfsArmazemMaisMassa(Data, ArmazensEmFalta,Viagem).


melhorViagemArmazemMaisMassa(Data, Camiao, Viagem, Tempo):-armazensViagem(ArmazensVisitar,Data),
                                                             bfsArmazemMaisMassa(Data,ArmazensVisitar,Viagem),
                                                             determinarTempo(Data, Camiao, Viagem, Tempo), !.

entregaMelhorRelacao(_,[],_, -10000000,_):-!.

entregaMelhorRelacao(Origem,[A1|Armazens], Data, MelhorRelacao, Armazem):-entregaMelhorRelacao(Origem, Armazens,Data,MelhorRelacao1,Armazem1),
                                                           dadosCam_t_e_ta(_,Origem,A1,Tempo,_,_),
                                                           entrega(_,Data,Massa,A1,_,_),
                                                           (((Massa/Tempo)>MelhorRelacao1,!, MelhorRelacao is (Massa/Tempo), Armazem = A1);MelhorRelacao is MelhorRelacao1, Armazem = Armazem1),!.

bfsMelhorRelacao(_,_,[],[]):-!.

bfsMelhorRelacao(Data,Origem,[A|RestantesArmazens],[ArmazemSeguinte|Viagem]):-entregaMelhorRelacao(Origem,[A|RestantesArmazens],Data,_,ArmazemSeguinte),
                                                                              delete([A|RestantesArmazens],ArmazemSeguinte,ArmazensEmFalta),
                                                                              bfsMelhorRelacao(Data, ArmazemSeguinte, ArmazensEmFalta,Viagem).


melhorViagemMelhorRelacao(Data, Camiao, Viagem, Tempo):-armazensViagem(ArmazensVisitar,Data),
                                                        cidadeArmazem(Origem),
                                                        bfsMelhorRelacao(Data,Origem,ArmazensVisitar,Viagem),
                                                        determinarTempo(Data, Camiao, Viagem, Tempo), !.

% -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.

%cidadeArmazem(<codigo>).
cidadeArmazem("005").

%dadosCam_t_e_ta(<nome_camiao>,<cidade_origem>,<cidade_destino>,<tempo>,<energia>,<tempo_adicional>).
dadosCam_t_e_ta(eTruck01,"001","002",122,42,0).
dadosCam_t_e_ta(eTruck01,"001","003",122,46,0).
dadosCam_t_e_ta(eTruck01,"001","004",151,54,25).
dadosCam_t_e_ta(eTruck01,"001","005",147,52,25).
dadosCam_t_e_ta(eTruck01,"001","006",74,24,0).
dadosCam_t_e_ta(eTruck01,"001","007",116,35,0).
dadosCam_t_e_ta(eTruck01,"001","008",141,46,0).
dadosCam_t_e_ta(eTruck01,"001","009",185,74,53).
dadosCam_t_e_ta(eTruck01,"001","010",97,30,0).
dadosCam_t_e_ta(eTruck01,"001","011",164,64,40).
dadosCam_t_e_ta(eTruck01,"001","012",76,23,0).
dadosCam_t_e_ta(eTruck01,"001","013",174,66,45).
dadosCam_t_e_ta(eTruck01,"001","014",59,18,0).
dadosCam_t_e_ta(eTruck01,"001","015",132,51,24).
dadosCam_t_e_ta(eTruck01,"001","016",181,68,45).
dadosCam_t_e_ta(eTruck01,"001","017",128,45,0).

dadosCam_t_e_ta(eTruck01,"002","001",116,42,0).
dadosCam_t_e_ta(eTruck01,"002","003",55,22,0).
dadosCam_t_e_ta(eTruck01,"002","004",74,25,0).
dadosCam_t_e_ta(eTruck01,"002","005",65,22,0).
dadosCam_t_e_ta(eTruck01,"002","006",69,27,0).
dadosCam_t_e_ta(eTruck01,"002","007",74,38,0).
dadosCam_t_e_ta(eTruck01,"002","008",61,18,0).
dadosCam_t_e_ta(eTruck01,"002","009",103,44,0).
dadosCam_t_e_ta(eTruck01,"002","010",36,14,0).
dadosCam_t_e_ta(eTruck01,"002","011",88,41,0).
dadosCam_t_e_ta(eTruck01,"002","012",61,19,0).
dadosCam_t_e_ta(eTruck01,"002","013",95,42,0).
dadosCam_t_e_ta(eTruck01,"002","014",78,34,0).
dadosCam_t_e_ta(eTruck01,"002","015",69,30,0).
dadosCam_t_e_ta(eTruck01,"002","016",99,38,0).
dadosCam_t_e_ta(eTruck01,"002","017",46,14,0).

dadosCam_t_e_ta(eTruck01,"003","001",120,45,0).
dadosCam_t_e_ta(eTruck01,"003","002",50,22,0).
dadosCam_t_e_ta(eTruck01,"003","004",46,15,0).
dadosCam_t_e_ta(eTruck01,"003","005",46,14,0).
dadosCam_t_e_ta(eTruck01,"003","006",74,37,0).
dadosCam_t_e_ta(eTruck01,"003","007",63,23,0).
dadosCam_t_e_ta(eTruck01,"003","008",38,8,0).
dadosCam_t_e_ta(eTruck01,"003","009",84,36,0).
dadosCam_t_e_ta(eTruck01,"003","010",59,28,0).
dadosCam_t_e_ta(eTruck01,"003","011",61,27,0).
dadosCam_t_e_ta(eTruck01,"003","012",67,32,0).
dadosCam_t_e_ta(eTruck01,"003","013",67,29,0).
dadosCam_t_e_ta(eTruck01,"003","014",82,38,0).
dadosCam_t_e_ta(eTruck01,"003","015",34,8,0).
dadosCam_t_e_ta(eTruck01,"003","016",80,30,0).
dadosCam_t_e_ta(eTruck01,"003","017",36,10,0).

dadosCam_t_e_ta(eTruck01,"004","001",149,54,25).
dadosCam_t_e_ta(eTruck01,"004","002",65,24,0).
dadosCam_t_e_ta(eTruck01,"004","003",46,16,0).
dadosCam_t_e_ta(eTruck01,"004","005",27,10,0).
dadosCam_t_e_ta(eTruck01,"004","006",103,47,0).
dadosCam_t_e_ta(eTruck01,"004","007",55,27,0).
dadosCam_t_e_ta(eTruck01,"004","008",36,10,0).
dadosCam_t_e_ta(eTruck01,"004","009",50,26,0).
dadosCam_t_e_ta(eTruck01,"004","010",78,34,0).
dadosCam_t_e_ta(eTruck01,"004","011",42,19,0).
dadosCam_t_e_ta(eTruck01,"004","012",97,42,0).
dadosCam_t_e_ta(eTruck01,"004","013",44,11,0).
dadosCam_t_e_ta(eTruck01,"004","014",111,48,0).
dadosCam_t_e_ta(eTruck01,"004","015",32,13,0).
dadosCam_t_e_ta(eTruck01,"004","016",53,14,0).
dadosCam_t_e_ta(eTruck01,"004","017",38,11,0).

dadosCam_t_e_ta(eTruck01,"005","001",141,51,24).
dadosCam_t_e_ta(eTruck01,"005","002",55,20,0).
dadosCam_t_e_ta(eTruck01,"005","003",48,14,0).
dadosCam_t_e_ta(eTruck01,"005","004",25,9,0).
dadosCam_t_e_ta(eTruck01,"005","006",97,44,0).
dadosCam_t_e_ta(eTruck01,"005","007",55,28,0).
dadosCam_t_e_ta(eTruck01,"005","008",29,7,0).
dadosCam_t_e_ta(eTruck01,"005","009",48,24,0).
dadosCam_t_e_ta(eTruck01,"005","010",69,30,0).
dadosCam_t_e_ta(eTruck01,"005","011",53,26,0).
dadosCam_t_e_ta(eTruck01,"005","012",95,36,0).
dadosCam_t_e_ta(eTruck01,"005","013",63,20,0).
dadosCam_t_e_ta(eTruck01,"005","014",105,45,0).
dadosCam_t_e_ta(eTruck01,"005","015",34,14,0).
dadosCam_t_e_ta(eTruck01,"005","016",46,18,0).
dadosCam_t_e_ta(eTruck01,"005","017",27,7,0).

dadosCam_t_e_ta(eTruck01,"006","001",69,23,0).
dadosCam_t_e_ta(eTruck01,"006","002",71,27,0).
dadosCam_t_e_ta(eTruck01,"006","003",74,38,0).
dadosCam_t_e_ta(eTruck01,"006","004",103,46,0).
dadosCam_t_e_ta(eTruck01,"006","005",99,44,0).
dadosCam_t_e_ta(eTruck01,"006","007",88,48,0).
dadosCam_t_e_ta(eTruck01,"006","008",92,38,0).
dadosCam_t_e_ta(eTruck01,"006","009",134,66,45).
dadosCam_t_e_ta(eTruck01,"006","010",42,14,0).
dadosCam_t_e_ta(eTruck01,"006","011",116,56,30).
dadosCam_t_e_ta(eTruck01,"006","012",23,9,0).
dadosCam_t_e_ta(eTruck01,"006","013",126,58,33).
dadosCam_t_e_ta(eTruck01,"006","014",25,9,0).
dadosCam_t_e_ta(eTruck01,"006","015",84,44,0).
dadosCam_t_e_ta(eTruck01,"006","016",132,60,35).
dadosCam_t_e_ta(eTruck01,"006","017",80,38,0).

dadosCam_t_e_ta(eTruck01,"007","001",116,36,0).
dadosCam_t_e_ta(eTruck01,"007","002",71,38,0).
dadosCam_t_e_ta(eTruck01,"007","003",61,22,0).
dadosCam_t_e_ta(eTruck01,"007","004",53,26,0).
dadosCam_t_e_ta(eTruck01,"007","005",53,28,0).
dadosCam_t_e_ta(eTruck01,"007","006",88,48,0).
dadosCam_t_e_ta(eTruck01,"007","008",59,26,0).
dadosCam_t_e_ta(eTruck01,"007","009",88,48,0).
dadosCam_t_e_ta(eTruck01,"007","010",84,44,0).
dadosCam_t_e_ta(eTruck01,"007","011",74,22,0).
dadosCam_t_e_ta(eTruck01,"007","012",82,42,0).
dadosCam_t_e_ta(eTruck01,"007","013",76,31,0).
dadosCam_t_e_ta(eTruck01,"007","014",97,49,21).
dadosCam_t_e_ta(eTruck01,"007","015",29,16,0).
dadosCam_t_e_ta(eTruck01,"007","016",84,42,0).
dadosCam_t_e_ta(eTruck01,"007","017",69,30,0).

dadosCam_t_e_ta(eTruck01,"008","001",134,46,0).
dadosCam_t_e_ta(eTruck01,"008","002",59,18,0).
dadosCam_t_e_ta(eTruck01,"008","003",32,6,0).
dadosCam_t_e_ta(eTruck01,"008","004",34,10,0).
dadosCam_t_e_ta(eTruck01,"008","005",32,7,0).
dadosCam_t_e_ta(eTruck01,"008","006",88,38,0).
dadosCam_t_e_ta(eTruck01,"008","007",57,26,0).
dadosCam_t_e_ta(eTruck01,"008","009",69,30,0).
dadosCam_t_e_ta(eTruck01,"008","010",65,26,0).
dadosCam_t_e_ta(eTruck01,"008","011",53,22,0).
dadosCam_t_e_ta(eTruck01,"008","012",82,34,0).
dadosCam_t_e_ta(eTruck01,"008","013",61,24,0).
dadosCam_t_e_ta(eTruck01,"008","014",97,40,0).
dadosCam_t_e_ta(eTruck01,"008","015",36,12,0).
dadosCam_t_e_ta(eTruck01,"008","016",65,23,0).
dadosCam_t_e_ta(eTruck01,"008","017",32,6,0).

dadosCam_t_e_ta(eTruck01,"009","001",181,72,50).
dadosCam_t_e_ta(eTruck01,"009","002",95,41,0).
dadosCam_t_e_ta(eTruck01,"009","003",86,35,0).
dadosCam_t_e_ta(eTruck01,"009","004",55,24,0).
dadosCam_t_e_ta(eTruck01,"009","005",48,23,0).
dadosCam_t_e_ta(eTruck01,"009","006",134,65,42).
dadosCam_t_e_ta(eTruck01,"009","007",95,47,0).
dadosCam_t_e_ta(eTruck01,"009","008",69,28,0).
dadosCam_t_e_ta(eTruck01,"009","010",109,51,24).
dadosCam_t_e_ta(eTruck01,"009","011",61,29,0).
dadosCam_t_e_ta(eTruck01,"009","012",132,57,31).
dadosCam_t_e_ta(eTruck01,"009","013",67,19,0).
dadosCam_t_e_ta(eTruck01,"009","014",143,66,45).
dadosCam_t_e_ta(eTruck01,"009","015",71,34,0).
dadosCam_t_e_ta(eTruck01,"009","016",15,3,0).
dadosCam_t_e_ta(eTruck01,"009","017",67,28,0).

dadosCam_t_e_ta(eTruck01,"010","001",97,30,0).
dadosCam_t_e_ta(eTruck01,"010","002",34,14,0).
dadosCam_t_e_ta(eTruck01,"010","003",59,27,0).
dadosCam_t_e_ta(eTruck01,"010","004",78,33,0).
dadosCam_t_e_ta(eTruck01,"010","005",71,30,0).
dadosCam_t_e_ta(eTruck01,"010","006",40,14,0).
dadosCam_t_e_ta(eTruck01,"010","007",82,42,0).
dadosCam_t_e_ta(eTruck01,"010","008",65,24,0).
dadosCam_t_e_ta(eTruck01,"010","009",109,52,25).
dadosCam_t_e_ta(eTruck01,"010","011",92,46,0).
dadosCam_t_e_ta(eTruck01,"010","012",32,6,0).
dadosCam_t_e_ta(eTruck01,"010","013",99,46,0).
dadosCam_t_e_ta(eTruck01,"010","014",63,17,0).
dadosCam_t_e_ta(eTruck01,"010","015",74,34,0).
dadosCam_t_e_ta(eTruck01,"010","016",105,46,0).
dadosCam_t_e_ta(eTruck01,"010","017",53,23,0).

dadosCam_t_e_ta(eTruck01,"011","001",164,65,42).
dadosCam_t_e_ta(eTruck01,"011","002",88,41,0).
dadosCam_t_e_ta(eTruck01,"011","003",65,28,0).
dadosCam_t_e_ta(eTruck01,"011","004",42,18,0).
dadosCam_t_e_ta(eTruck01,"011","005",55,25,0).
dadosCam_t_e_ta(eTruck01,"011","006",118,57,31).
dadosCam_t_e_ta(eTruck01,"011","007",74,23,0).
dadosCam_t_e_ta(eTruck01,"011","008",59,23,0).
dadosCam_t_e_ta(eTruck01,"011","009",63,28,0).
dadosCam_t_e_ta(eTruck01,"011","010",97,46,0).
dadosCam_t_e_ta(eTruck01,"011","012",111,52,25).
dadosCam_t_e_ta(eTruck01,"011","013",25,7,0).
dadosCam_t_e_ta(eTruck01,"011","014",126,58,33).
dadosCam_t_e_ta(eTruck01,"011","015",53,25,0).
dadosCam_t_e_ta(eTruck01,"011","016",59,27,0).
dadosCam_t_e_ta(eTruck01,"011","017",67,27,0).

dadosCam_t_e_ta(eTruck01,"012","001",76,23,0).
dadosCam_t_e_ta(eTruck01,"012","002",61,19,0).
dadosCam_t_e_ta(eTruck01,"012","003",67,32,0).
dadosCam_t_e_ta(eTruck01,"012","004",97,41,0).
dadosCam_t_e_ta(eTruck01,"012","005",92,38,0).
dadosCam_t_e_ta(eTruck01,"012","006",19,8,0).
dadosCam_t_e_ta(eTruck01,"012","007",82,42,0).
dadosCam_t_e_ta(eTruck01,"012","008",86,33,0).
dadosCam_t_e_ta(eTruck01,"012","009",128,61,37).
dadosCam_t_e_ta(eTruck01,"012","010",32,6,0).
dadosCam_t_e_ta(eTruck01,"012","011",109,50,23).
dadosCam_t_e_ta(eTruck01,"012","013",120,53,26).
dadosCam_t_e_ta(eTruck01,"012","014",40,10,0).
dadosCam_t_e_ta(eTruck01,"012","015",78,38,0).
dadosCam_t_e_ta(eTruck01,"012","016",126,54,28).
dadosCam_t_e_ta(eTruck01,"012","017",74,32,0).

dadosCam_t_e_ta(eTruck01,"013","001",174,65,42).
dadosCam_t_e_ta(eTruck01,"013","002",107,35,0).
dadosCam_t_e_ta(eTruck01,"013","003",74,29,0).
dadosCam_t_e_ta(eTruck01,"013","004",46,11,0).
dadosCam_t_e_ta(eTruck01,"013","005",67,20,0).
dadosCam_t_e_ta(eTruck01,"013","006",128,57,31).
dadosCam_t_e_ta(eTruck01,"013","007",80,30,0).
dadosCam_t_e_ta(eTruck01,"013","008",76,20,0).
dadosCam_t_e_ta(eTruck01,"013","009",67,20,0).
dadosCam_t_e_ta(eTruck01,"013","010",105,47,0).
dadosCam_t_e_ta(eTruck01,"013","011",27,7,0).
dadosCam_t_e_ta(eTruck01,"013","012",122,52,25).
dadosCam_t_e_ta(eTruck01,"013","014",137,58,33).
dadosCam_t_e_ta(eTruck01,"013","015",67,17,0).
dadosCam_t_e_ta(eTruck01,"013","016",59,15,0).
dadosCam_t_e_ta(eTruck01,"013","017",78,22,0).

dadosCam_t_e_ta(eTruck01,"014","001",59,18,0).
dadosCam_t_e_ta(eTruck01,"014","002",80,35,0).
dadosCam_t_e_ta(eTruck01,"014","003",80,38,0).
dadosCam_t_e_ta(eTruck01,"014","004",109,46,0).
dadosCam_t_e_ta(eTruck01,"014","005",105,45,0).
dadosCam_t_e_ta(eTruck01,"014","006",27,9,0).
dadosCam_t_e_ta(eTruck01,"014","007",97,48,0).
dadosCam_t_e_ta(eTruck01,"014","008",99,38,0).
dadosCam_t_e_ta(eTruck01,"014","009",143,66,45).
dadosCam_t_e_ta(eTruck01,"014","010",61,17,0).
dadosCam_t_e_ta(eTruck01,"014","011",122,57,31).
dadosCam_t_e_ta(eTruck01,"014","012",42,10,0).
dadosCam_t_e_ta(eTruck01,"014","013",132,58,35).
dadosCam_t_e_ta(eTruck01,"014","015",90,44,0).
dadosCam_t_e_ta(eTruck01,"014","016",139,61,37).
dadosCam_t_e_ta(eTruck01,"014","017",86,38,0).

dadosCam_t_e_ta(eTruck01,"015","001",132,51,24).
dadosCam_t_e_ta(eTruck01,"015","002",74,30,0).
dadosCam_t_e_ta(eTruck01,"015","003",34,8,0).
dadosCam_t_e_ta(eTruck01,"015","004",36,12,0).
dadosCam_t_e_ta(eTruck01,"015","005",36,14,0).
dadosCam_t_e_ta(eTruck01,"015","006",86,44,0).
dadosCam_t_e_ta(eTruck01,"015","007",34,16,0).
dadosCam_t_e_ta(eTruck01,"015","008",42,13,0).
dadosCam_t_e_ta(eTruck01,"015","009",71,35,0).
dadosCam_t_e_ta(eTruck01,"015","010",82,36,0).
dadosCam_t_e_ta(eTruck01,"015","011",53,25,0).
dadosCam_t_e_ta(eTruck01,"015","012",80,38,0).
dadosCam_t_e_ta(eTruck01,"015","013",69,18,0).
dadosCam_t_e_ta(eTruck01,"015","014",95,45,0).
dadosCam_t_e_ta(eTruck01,"015","016",69,29,0).
dadosCam_t_e_ta(eTruck01,"015","017",53,17,0).

dadosCam_t_e_ta(eTruck01,"016","001",179,68,45).
dadosCam_t_e_ta(eTruck01,"016","002",92,37,0).
dadosCam_t_e_ta(eTruck01,"016","003",84,31,0).
dadosCam_t_e_ta(eTruck01,"016","004",57,16,0).
dadosCam_t_e_ta(eTruck01,"016","005",46,18,0).
dadosCam_t_e_ta(eTruck01,"016","006",132,60,35).
dadosCam_t_e_ta(eTruck01,"016","007",92,42,0).
dadosCam_t_e_ta(eTruck01,"016","008",67,23,0).
dadosCam_t_e_ta(eTruck01,"016","009",15,3,0).
dadosCam_t_e_ta(eTruck01,"016","010",105,46,0).
dadosCam_t_e_ta(eTruck01,"016","011",57,28,0).
dadosCam_t_e_ta(eTruck01,"016","012",130,52,25).
dadosCam_t_e_ta(eTruck01,"016","013",61,15,0).
dadosCam_t_e_ta(eTruck01,"016","014",141,61,37).
dadosCam_t_e_ta(eTruck01,"016","015",69,29,0).
dadosCam_t_e_ta(eTruck01,"016","017",65,24,0).

dadosCam_t_e_ta(eTruck01,"017","001",128,46,0).
dadosCam_t_e_ta(eTruck01,"017","002",42,14,0).
dadosCam_t_e_ta(eTruck01,"017","003",40,11,0).
dadosCam_t_e_ta(eTruck01,"017","004",42,13,0).
dadosCam_t_e_ta(eTruck01,"017","005",34,10,0).
dadosCam_t_e_ta(eTruck01,"017","006",82,38,0).
dadosCam_t_e_ta(eTruck01,"017","007",74,30,0).
dadosCam_t_e_ta(eTruck01,"017","008",29,6,0).
dadosCam_t_e_ta(eTruck01,"017","009",69,31,0).
dadosCam_t_e_ta(eTruck01,"017","010",55,24,0).
dadosCam_t_e_ta(eTruck01,"017","011",69,29,0).
dadosCam_t_e_ta(eTruck01,"017","012",80,30,0).
dadosCam_t_e_ta(eTruck01,"017","013",82,23,0).
dadosCam_t_e_ta(eTruck01,"017","014",90,38,0).
dadosCam_t_e_ta(eTruck01,"017","015",53,18,0).
dadosCam_t_e_ta(eTruck01,"017","016",67,25,0).
