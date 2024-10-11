consult("4_us515_aStar.pl").

%EDIFICIOS LOCALIZACAO
node(aa,2,5).
node(abeng, 4,5).
node(ak1, 6,5).
node(ak2, 8,5).
node(ar1, 10,5).
node(ar2, 12,5).
node(a1elevador, 14,5).

node(a201, 3,10).
node(a202, 5,10).
node(a203, 7,10).
node(a204, 9,10).
node(a205, 11,10).
node(a206, 13,10).
node(a207, 15,10).
node(a208, 17, 10).
node(a209, 19, 10).
node(a2elevador, 21, 10).
node(a2passagemb2, 23, 10).

node(b1elevador, 28, 5).
node(b101, 30 ,5).
node(b102, 32,5).
node(b103, 34,5).
node(b104, 36,5).
node(b106, 37,5).
node(b107, 38,5).
node(b106b, 40,5).

node(b201, 29,10).
node(b202, 31,10).
node(b203, 32,10).
node(b205, 33,10).
node(b207, 35,10).
node(b2elevador, 37, 10).
node(b2passagemc3, 39, 10).
node(b2passagemd3, 41, 10).

node(b301, 28, 30).
node(b302, 32, 30).
node(b303, 34, 30).
node(b305, 30, 30).
node(b3elevador, 36, 30).
node(b3passagemc4, 38, 30).

node(c101, 42, 5).
node(c102, 44, 5).
node(c103, 46,5).
node(c104, 48, 5).
node(c105, 50, 5).
node(c106, 52, 5).
node(c108, 54, 5).
node(c110, 56, 5).
node(c1elevador, 58, 5).

node(c201, 43, 10).
node(c202, 45, 10).
node(c203, 47,10).
node(c204, 49, 10).
node(c205, 51, 10).
node(c206, 53, 10).
node(c209, 55, 10).
node(c2elevador, 57, 10).
node(c2passagemd2, 59, 10).

node(c301, 42, 30).
node(c3passagemb2, 44, 30).
node(c302, 46, 30).
node(c303, 48, 30).
node(c304, 50, 30).
node(c305, 52, 30).
node(c306, 54, 30).
node(c308, 56, 30).
node(c310, 58, 30).
node(c3passagemd3, 60, 30).
node(c3elevador, 62, 30).

node(c401, 42, 40).
node(c4passagemb3, 41, 40).
node(c402, 43, 40).
node(c403, 44, 40).
node(c404, 45, 40).
node(c4elevador, 46, 40).


node(d101, 80, 5).
node(d102, 81, 5).
node(d103, 82, 5).
node(d104, 83, 5).
node(d105, 84, 5).
node(d106, 85, 5).
node(d108, 86, 5).
node(d1elevador, 87, 5).

node(d2passagem, 80, 10).
node(d201, 82, 10).
node(d202, 84, 10).
node(d203, 86, 10).
node(d204, 87, 10).
node(d205, 88, 10).
node(d206, 90, 10).
node(d2elevador, 92, 10).

node(d301, 83, 30).
node(d3passagemc3, 85, 30).
node(d3passagemb2, 87, 30).
node(d302, 89, 30).
node(d303, 90, 30).
node(d304, 91, 30).
node(d305, 92, 30).
node(d3elevador, 93, 30).

%ligacoes elevadores 
edge(a1elevador, a2elevador, 30).
edge(a2elevador, a1elevador, 30).

edge(b1elevador, b2elevador, 30).
edge(b1elevador, b3elevador, 30).
edge(b2elevador, b1elevador, 30).
edge(b2elevador, b3elevador, 30).
edge(b3elevador, b1elevador, 30).
edge(b3elevador, b2elevador, 30).


edge(c1elevador, c2elevador, 30).
edge(c1elevador, c3elevador, 30).
edge(c1elevador, c4elevador, 30).
edge(c2elevador, c1elevador, 30).
edge(c2elevador, c3elevador, 30).
edge(c2elevador, c4elevador, 30).
edge(c3elevador, c1elevador, 30).
edge(c3elevador, c2elevador, 30).
edge(c3elevador, c4elevador, 30).
edge(c4elevador, c1elevador, 30).
edge(c4elevador, c2elevador, 30).
edge(c4elevador, c3elevador, 30).

edge(d1elevador, d2elevador, 30).
edge(d1elevador, d3elevador, 30).
edge(d2elevador, d1elevador, 30).
edge(d2elevador, d3elevador, 30).
edge(d3elevador, d1elevador, 30).
edge(d3elevador, d2elevador, 30).



%EDIFICIOS LIGACAO ENTRE PASSAGENS 
edge(a2passagemb2, b2passagema2, 5).
edge(b2passagemc3, c3passagemb2, 5).
edge(b2passagemd3, d3passagemb2, 5).
edge(c2passagemd2, d2passagemc2, 5).
edge(c3passagemd3, d3passagemc3, 5).
edge(c3passagemb2, b2passagemc3, 5).
edge(c4passagemb3, b3passagemc4, 5).
edge(d3passagemc3, c3passagemd3, 5).
edge(d3passagemb2, b2passagemd3, 5).
edge(d2passagemc2, c2passagemd2, 5).

edge(b2passagema2, a2passagemb2, 5).
edge(c3passagemb2, b2passagemc3, 5).
edge(d3passagemb2, b2passagemd3, 5).
edge(d2passagemc2, c2passagemd2, 5).
edge(d3passagemc3, c3passagemd3, 5).
edge(b2passagemc3, c3passagemb2, 5).
edge(b3passagemc4, c4passagemb3, 5).
edge(c3passagemd3, d3passagemc3, 5).
edge(b2passagemd3, d3passagemb2, 5).
edge(c2passagemd2, d2passagemc2, 5).

%LIGACAO DENTRO DO EDIFICIOS
edge(aa,abeng,4).
edge(abeng,aa,3).
edge(abeng, ak1,2).
edge(ak1, abeng,2).
edge(ak2, ak1,3).
edge(ak1, ak2,4).
edge(ar1, ak2,5).
edge(ar2, ar1,4).
edge(ar2, a1elevador, 3).

edge(aa, a1elevador, 7).
edge(abeng, a1elevador, 15).
edge(ak1, a1elevador, 8).
edge(ak2, a1elevador, 4).
edge(ar1, a1elevador, 10).
edge(a1elevador, ar2, 13).

edge(a1elevador, aa, 10).
edge(a1elevador, abeng, 6).
edge(a1elevador, ak1, 14).
edge(a1elevador, ak2, 9).
edge(a1elevador, ar1, 11).

edge(a201, a202, 7).
edge(a201, a203, 16).
edge(a201, a204, 9).
edge(a201, a205, 8).
edge(a201, a206, 19).
edge(a201, a207, 4).
edge(a201, a208, 22).
edge(a201, a209, 12).
edge(a201, a2elevador, 14).
edge(a201, a2passagemb2, 21).

edge(a202, a201, 10).
edge(a202, a203, 17).
edge(a202, a204, 11).
edge(a202, a205, 8).
edge(a202, a206, 15).
edge(a202, a207, 19).
edge(a202, a208, 6).
edge(a202, a209, 14).
edge(a202, a2elevador, 9).
edge(a202, a2passagemb2, 16).

edge(a203, a201, 14).
edge(a203, a202, 8).
edge(a203, a204, 7).
edge(a203, a205, 20).
edge(a203, a206, 12).
edge(a203, a207, 18).
edge(a203, a208, 15).
edge(a203, a209, 11).
edge(a203, a2elevador, 16).
edge(a203, a2passagemb2, 10).

edge(a204, a201, 9).
edge(a204, a202, 13).
edge(a204, a203, 11).
edge(a204, a205, 17).
edge(a204, a206, 8).
edge(a204, a207, 14).
edge(a204, a208, 20).
edge(a204, a209, 12).
edge(a204, a2elevador, 18).
edge(a204, a2passagemb2, 7).

edge(a205, a201, 12).
edge(a205, a202, 6).
edge(a205, a203, 15).
edge(a205, a204, 21).
edge(a205, a206, 10).
edge(a205, a207, 8).
edge(a205, a208, 14).
edge(a205, a209, 19).
edge(a205, a2elevador, 9).
edge(a205, a2passagemb2, 13).

edge(a206, a201, 18).
edge(a206, a202, 14).
edge(a206, a203, 10).
edge(a206, a205, 11).
edge(a206, a204, 9).
edge(a206, a207, 15).
edge(a206, a208, 13).
edge(a206, a209, 16).
edge(a206, a2elevador, 12).
edge(a206, a2passagemb2, 17).

edge(a207, a201, 16).
edge(a207, a202, 12).
edge(a207, a203, 14).
edge(a207, a205, 7).
edge(a207, a206, 11).
edge(a207, a204, 18).
edge(a207, a208, 10).
edge(a207, a209, 15).
edge(a207, a2elevador, 8).
edge(a207, a2passagemb2, 9).

edge(a208, a201, 11).
edge(a208, a202, 17).
edge(a208, a203, 13).
edge(a208, a205, 10).
edge(a208, a206, 16).
edge(a208, a204, 12).
edge(a208, a207, 9).
edge(a208, a209, 14).
edge(a208, a2elevador, 13).
edge(a208, a2passagemb2, 18).

edge(a209, a201, 14).
edge(a209, a202, 9).
edge(a209, a203, 15).
edge(a209, a205, 12).
edge(a209, a206, 16).
edge(a209, a204, 11).
edge(a209, a208, 13).
edge(a209, a207, 17).
edge(a209, a2elevador, 10).
edge(a209, a2passagemb2, 14).

edge(a2elevador, a201, 10).
edge(a2elevador, a202, 16).
edge(a2elevador, a203, 12).
edge(a2elevador, a205, 15).
edge(a2elevador, a206, 13).
edge(a2elevador, a204, 8).
edge(a2elevador, a208, 14).
edge(a2elevador, a207, 9).
edge(a2elevador, a2passagemb2, 11).

edge(a2passagemb2, a201, 13).
edge(a2passagemb2, a202, 8).
edge(a2passagemb2, a203, 14).
edge(a2passagemb2, a205, 11).
edge(a2passagemb2, a206, 17).
edge(a2passagemb2, a204, 9).
edge(a2passagemb2, a208, 12).
edge(a2passagemb2, a207, 15).
edge(a2passagemb2, a2elevador, 16).

edge(b1elevador, b101, 15).
edge(b1elevador, b102, 9).
edge(b1elevador, b103, 7).
edge(b1elevador, b104, 18).
edge(b1elevador, b105, 14).
edge(b1elevador, b106, 12).
edge(b1elevador, b106b, 19).
edge(b1elevador, b107, 10).

edge(b101, b102, 10).
edge(b101, b103, 13).
edge(b101, b104, 8).
edge(b101, b105, 15).
edge(b101, b106, 12).
edge(b101, b106b, 11).
edge(b101, b107, 17).
edge(b101, b1elevador, 14).

edge(b102, b101, 7).
edge(b102, b103, 12).
edge(b102, b104, 6).
edge(b102, b105, 16).
edge(b102, b106, 9).
edge(b102, b107, 14).
edge(b102, b106b, 8).
edge(b102, b1elevador, 11).

edge(b103, b101, 15).
edge(b103, b102, 11).
edge(b103, b104, 10).
edge(b103, b105, 17).
edge(b103, b106, 8).
edge(b103, b107, 14).
edge(b103, b106b, 13).
edge(b103, b1elevador, 18).

edge(b104, b101, 12).
edge(b104, b102, 16).
edge(b104, b103, 13).
edge(b104, b105, 10).
edge(b104, b106, 11).
edge(b104, b107, 9).
edge(b104, b106b, 14).
edge(b104, b1elevador, 8).

edge(b106, b101, 14).
edge(b106, b102, 7).
edge(b106, b103, 9).
edge(b106, b105, 18).
edge(b106, b104, 16).
edge(b106, b107, 11).
edge(b106, b106b, 12).
edge(b106, b1elevador, 13).

% Nuevos pesos para las conexiones adicionales
edge(b107, b101, 4).
edge(b107, b102, 5).
edge(b107, b103, 3).
edge(b107, b105, 6).
edge(b107, b104, 7).
edge(b107, b106, 3).
edge(b107, b106b, 4).
edge(b107, b1elevador, 3).

edge(b106b, b101, 6).
edge(b106b, b102, 5).
edge(b106b, b103, 3).
edge(b106b, b105, 4).
edge(b106b, b104, 7).
edge(b106b, b107, 5).
edge(b106b, b106, 3).
edge(b106b, b1elevador, 4).

edge(b201, b202, 4).
edge(b201, b203, 5).
edge(b201, b204, 3).
edge(b201, b205, 6).
edge(b201, b206, 5).
edge(b201, b207, 4).
edge(b201, b2elevador, 3).
edge(b201, b2passagemc3, 4).
edge(b201, b2passagemd3, 5).

edge(b202, b201, 3).
edge(b202, b203, 5).
edge(b202, b204, 6).
edge(b202, b205, 4).
edge(b202, b206, 5).
edge(b202, b207, 4).
edge(b202, b2elevador, 3).
edge(b202, b2passagemc3, 4).
edge(b202, b2passagemd3, 5).

edge(b203, b201, 6).
edge(b203, b202, 4).
edge(b203, b204, 3).
edge(b203, b205, 5).
edge(b203, b206, 4).
edge(b203, b207, 3).
edge(b203, b2elevador, 4).
edge(b203, b2passagemc3, 5).
edge(b203, b2passagemd3, 3).

edge(b205, b201, 5).
edge(b205, b202, 3).
edge(b205, b204, 6).
edge(b205, b203, 5).
edge(b205, b206, 4).
edge(b205, b207, 3).
edge(b205, b2elevador, 4).
edge(b205, b2passagemc3, 5).
edge(b205, b2passagemd3, 3).

edge(b207, b201, 3).
edge(b207, b202, 4).
edge(b207, b204, 5).
edge(b207, b203, 4).
edge(b207, b206, 3).
edge(b207, b205, 4).
edge(b207, b2elevador, 3).
edge(b207, b2passagemc3, 4).
edge(b207, b2passagemd3, 5).

edge(b2elevador, b201, 4).
edge(b2elevador, b202, 3).
edge(b2elevador, b204, 5).
edge(b2elevador, b203, 4).
edge(b2elevador, b206, 3).
edge(b2elevador, b205, 4).
edge(b2elevador, b2passagemc3, 5).
edge(b2elevador, b2passagemd3, 4).

edge(b2passagemc3, b201, 3).
edge(b2passagemc3, b202, 4).
edge(b2passagemc3, b204, 5).
edge(b2passagemc3, b203, 4).
edge(b2passagemc3, b206, 3).
edge(b2passagemc3, b205, 4).
edge(b2passagemc3, b2elevador, 5).
edge(b2passagemc3, b2passagemd3, 4).

edge(b2passagemd3, b201, 4).
edge(b2passagemd3, b202, 3).
edge(b2passagemd3, b204, 5).
edge(b2passagemd3, b203, 4).
edge(b2passagemd3, b206, 3).
edge(b2passagemd3, b205, 4).
edge(b2passagemd3, b2elevador, 5).
edge(b2passagemd3, b2passagemc3, 4).

edge(b301, b302, 2).
edge(b301, b303, 4).
edge(b301, b305, 3).
edge(b301, b3elevador, 4).
edge(b301, b3passagemc4, 3).

edge(b302, b301, 3).
edge(b302, b303, 4).
edge(b302, b305, 2).
edge(b302, b3elevador, 3).
edge(b302, b3passagemc4, 4).

edge(b303, b301, 5).
edge(b303, b302, 3).
edge(b303, b305, 4).
edge(b303, b3elevador, 4).
edge(b303, b3passagemc4, 2).

edge(b305, b301, 3).
edge(b305, b303, 4).
edge(b305, b302, 2).
edge(b305, b3elevador, 3).
edge(b305, b3passagemc4, 4).

edge(b3elevador, b301, 3).
edge(b3elevador, b302, 3).
edge(b3elevador, b303, 3).
edge(b3elevador, b3passagemc4, 4).

edge(b3passagemc4, b301, 3).
edge(b3passagemc4, b302, 4).
edge(b3passagemc4, b303, 3).
edge(b3passagemc4, b3elevador, 4).

edge(c101, c102, 5).
edge(c101, c103, 4).
edge(c101, c104, 3).
edge(c101, c105, 4).
edge(c101, c106, 3).
edge(c101, c108, 4).
edge(c101, c110, 3).
edge(c101, c1elevador, 3).


% Nuevos pesos para las conexiones adicionales
edge(c102, c101, 5).
edge(c102, c103, 3).
edge(c102, c104, 4).
edge(c102, c105, 6).
edge(c102, c106, 3).
edge(c102, c108, 4).
edge(c102, c110, 4).
edge(c102, c1elevador, 3).

edge(c103, c101, 3).
edge(c103, c102, 4).
edge(c103, c104, 5).
edge(c103, c105, 3).
edge(c103, c106, 3).
edge(c103, c108, 4).
edge(c103, c110, 6).
edge(c103, c1elevador, 3).

edge(c104, c101, 4).
edge(c104, c103, 5).
edge(c104, c102, 5).
edge(c104, c105, 5).
edge(c104, c106, 6).
edge(c104, c108, 2).
edge(c104, c110, 3).
edge(c104, c1elevador, 3).

edge(c105, c101, 6).
edge(c105, c103, 3).
edge(c105, c104, 4).
edge(c105, c102, 3).
edge(c105, c106, 4).
edge(c105, c108, 5).
edge(c105, c110, 6).
edge(c105, c1elevador, 3).

edge(c106, c101, 5).
edge(c106, c103, 4).
edge(c106, c104, 3).
edge(c106, c105, 1).
edge(c106, c102, 3).
edge(c106, c108, 3).
edge(c106, c110, 3).
edge(c106, c1elevador, 3).

edge(c108, c101, 3).
edge(c108, c103, 2).
edge(c108, c104, 2).
edge(c108, c105, 2).
edge(c108, c106, 2).
edge(c108, c102, 6).
edge(c108, c110, 5).
edge(c108, c1elevador, 3).

edge(c110, c101, 2).
edge(c110, c103, 3).
edge(c110, c104, 1).
edge(c110, c105, 1).
edge(c110, c106, 4).
edge(c110, c102, 5).
edge(c110, c108, 1).
edge(c110, c1elevador, 3).

edge(c1elevador, c101, 3).
edge(c1elevador, c102, 3).
edge(c1elevador, c103, 3).
edge(c1elevador, c104, 3).
edge(c1elevador, c106, 3).
edge(c1elevador, c108, 3).


edge(c201, c202, 3).
edge(c201, c203, 4).
edge(c201, c204, 5).
edge(c201, c205, 4).
edge(c201, c206, 3).
edge(c201, c209, 2).
edge(c201, c2elevador, 3).
edge(c201, c2passagemd2, 3).

edge(c202, c201, 5).
edge(c202, c203, 4).
edge(c202, c204, 3).
edge(c202, c205, 4).
edge(c202, c206, 5).
edge(c202, c209, 5).
edge(c202, c2elevador, 3).
edge(c202, c2passagemd2, 3).

edge(c203, c201, 5).
edge(c203, c202, 4).
edge(c203, c204, 3).
edge(c203, c205, 4).
edge(c203, c206, 5).
edge(c203, c209, 5).
edge(c203, c2elevador, 3).
edge(c203, c2passagemd2, 3).

edge(c204, c201, 7).
edge(c204, c202, 6).
edge(c204, c203, 5).
edge(c204, c205, 6).
edge(c204, c206, 5).
edge(c204, c209, 4).
edge(c204, c2elevador, 3).
edge(c204, c2passagemd2, 3).

edge(c205, c201, 8).
edge(c205, c202, 9).
edge(c205, c203, 10).
edge(c205, c204, 22).
edge(c205, c206, 23).
edge(c205, c209, 32).
edge(c205, c2elevador, 3).
edge(c205, c2passagemd2, 3).

edge(c206, c201, 8).
edge(c206, c202, 9).
edge(c206, c203, 10).
edge(c206, c204, 22).
edge(c206, c205, 23).
edge(c206, c209, 32).
edge(c206, c2elevador, 3).
edge(c206, c2passagemd2, 3).

edge(c209, c201, 3).
edge(c209, c202, 4).
edge(c209, c203, 5).
edge(c209, c204, 7).
edge(c209, c206, 6).
edge(c209, c205, 7).
edge(c209, c2elevador, 3).
edge(c209, c2passagemd2, 3).

edge(c2elevador, c201, 3).
edge(c2elevador, c202, 3).
edge(c2elevador, c203, 3).
edge(c2elevador, c204, 3).
edge(c2elevador, c206, 3).
edge(c2elevador, c205, 3).
edge(c2elevador, c209, 3).
edge(c2elevador, c2passagemd2, 3).

edge(c2passagemd2, c201, 3).
edge(c2passagemd2, c202, 3).
edge(c2passagemd2, c203, 3).
edge(c2passagemd2, c204, 3).
edge(c2passagemd2, c206, 3).
edge(c2passagemd2, c205, 3).
edge(c2passagemd2, 209, 3).
edge(c2passagemd2, c2elevador, 3).

edge(c301, c3passagemb2, 21).
edge(c301, c302, 5).
edge(c301, c303, 10).
edge(c301, c304, 3).
edge(c301, c305, 12).
edge(c301, c306, 24).
edge(c301, c308, 14).
edge(c301, c310, 18).
edge(c301, c3passagemd3, 8).
edge(c301, c3elevador, 22).

edge(c3passagemb2, c301, 11).
edge(c3passagemb2, c302, 17).
edge(c3passagemb2, c303, 4).
edge(c3passagemb2, c304, 6).
edge(c3passagemb2, c305, 8).
edge(c3passagemb2, c306, 13).
edge(c3passagemb2, c308, 9).
edge(c3passagemb2, c310, 15).
edge(c3passagemb2, c3passagemd3, 14).
edge(c3passagemb2, c3elevador, 16).

edge(c302, c301, 23).
edge(c302, c303, 14).
edge(c302, c304, 15).
edge(c302, c305, 5).
edge(c302, c306, 6).
edge(c302, c308, 17).
edge(c302, c310, 8).
edge(c302, c3passagemd3, 10).
edge(c302, c3elevador, 13).

edge(c303, c301, 24).
edge(c303, c302, 18).
edge(c303, c304, 10).
edge(c303, c305, 16).
edge(c303, c306, 9).
edge(c303, c308, 8).
edge(c303, c310, 21).
edge(c303, c3passagemd3, 22).
edge(c303, c3elevador, 4).

edge(c304, c301, 9).
edge(c304, c302, 5).
edge(c304, c303, 14).
edge(c304, c305, 17).
edge(c304, c306, 3).
edge(c304, c308, 23).
edge(c304, c310, 19).
edge(c304, c3passagemd3, 7).
edge(c304, c3elevador, 24).

edge(c305, c301, 15).
edge(c305, c302, 12).
edge(c305, c303, 20).
edge(c305, c304, 22).
edge(c305, c306, 4).
edge(c305, c308, 13).
edge(c305, c310, 25).
edge(c305, c3passagemd3, 6).
edge(c305, c3elevador, 2).

edge(c306, c301, 11).
edge(c306, c302, 10).
edge(c306, c303, 25).
edge(c306, c304, 14).
edge(c306, c305, 7).
edge(c306, c308, 16).
edge(c306, c310, 20).
edge(c306, c3passagemd3, 19).
edge(c306, c3elevador, 21).

edge(c308, c301, 5).
edge(c308, c302, 22).
edge(c308, c303, 10).
edge(c308, c304, 23).
edge(c308, c306, 17).
edge(c308, c305, 3).
edge(c308, c310, 14).
edge(c308, c3passagemd3, 12).
edge(c308, c3elevador, 8).

edge(c310, c301, 6).
edge(c310, c302, 20).
edge(c310, c303, 7).
edge(c310, c304, 12).
edge(c310, c306, 25).
edge(c310, c305, 16).
edge(c310, c308, 14).
edge(c310, c3passagemd3, 23).
edge(c310, c3elevador, 15).

edge(c3passagemd3, c301, 17).
edge(c3passagemd3, c302, 11).
edge(c3passagemd3, c303, 13).
edge(c3passagemd3, c304, 9).
edge(c3passagemd3, c306, 14).
edge(c3passagemd3, c305, 22).
edge(c3passagemd3, c308, 5).
edge(c3passagemd3, c310, 20).
edge(c3passagemd3, c3elevador, 7).

edge(c3elevador, c301, 10).
edge(c3elevador, c302, 12).
edge(c3elevador, c303, 17).
edge(c3elevador, c304, 7).
edge(c3elevador, c306, 24).
edge(c3elevador, c305, 21).
edge(c3elevador, c308, 9).
edge(c3elevador, c310, 6).
edge(c3elevador, c3passagemd3, 19).

edge(c401, c4passagemb3, 4).
edge(c401, c402, 13).
edge(c401, c403, 6).
edge(c401, c404, 16).
edge(c404, c4elevador, 24).

edge(c402, c4passagemb3, 23).
edge(c402, c401, 20).
edge(c402, c403, 14).
edge(c402, c404, 7).
edge(c402, c4elevador, 5).

edge(c403, c4passagemb3, 18).
edge(c403, c401, 9).
edge(c403, c402, 4).
edge(c403, c404, 10).
edge(c403, c4elevador, 21).

edge(c404, c4passagemb3, 8).
edge(c404, c401, 15).
edge(c404, c402, 25).
edge(c404, c403, 11).
edge(c404, c4elevador, 19).

edge(c4passagemb3, c404, 16).
edge(c4passagemb3, c401, 7).
edge(c4passagemb3, c402, 3).
edge(c4passagemb3, c403, 12).
edge(c4passagemb3, c4elevador, 22).

edge(c4elevador, c404, 4).
edge(c4elevador, c401, 11).
edge(c4elevador, c402, 24).
edge(c4elevador, c403, 15).
edge(c4elevador, c4passagemb3, 14).

edge(d101, d102, 21).
edge(d101, d103, 4).
edge(d101, d104, 10).
edge(d101, d105, 16).
edge(d101, d106, 8).
edge(d101, d108, 18).
edge(d101, d1elevador, 6).

edge(d102, d101, 11).
edge(d102, d103, 7).
edge(d102, d104, 14).
edge(d102, d105, 6).
edge(d102, d106, 9).
edge(d102, d108, 22).
edge(d102, d1elevador, 19).

edge(d103, d101, 15).
edge(d103, d102, 20).
edge(d103, d104, 12).
edge(d103, d105, 17).
edge(d103, d106, 8).
edge(d103, d108, 14).
edge(d103, d1elevador, 13).

edge(d104, d101, 19).
edge(d104, d103, 13).
edge(d104, d102, 8).
edge(d104, d105, 11).
edge(d104, d106, 6).
edge(d104, d108, 16).
edge(d104, d1elevador, 7).

edge(d105, d101, 24).
edge(d105, d103, 4).
edge(d105, d104, 6).
edge(d105, d102, 17).
edge(d105, d106, 22).
edge(d105, d108, 10).
edge(d105, d1elevador, 14).

edge(d106, d101, 15).
edge(d106, d103, 20).
edge(d106, d104, 12).
edge(d106, d102, 6).
edge(d106, d105, 9).
edge(d106, d108, 8).
edge(d106, d1elevador, 13).

edge(d108, d101, 18).
edge(d108, d103, 5).
edge(d108, d104, 14).
edge(d108, d102, 12).
edge(d108, d105, 23).
edge(d108, d106, 7).
edge(d108, d1elevador, 11).

edge(d1elevador, d101, 4).
edge(d1elevador, d103, 9).
edge(d1elevador, d104, 20).
edge(d1elevador, d102, 8).
edge(d1elevador, d105, 15).
edge(d1elevador, d106, 17).
edge(d1elevador, d108, 19).

edge(d2passagem, d201, 4).
edge(d2passagem, d202, 14).
edge(d2passagem, d203, 10).
edge(d2passagem, d204, 6).
edge(d2passagem, d205, 25).
edge(d2passagem, d206, 19).
edge(d2passagem, d2elevador, 8).

edge(d202, d201, 7).
edge(d202, d2passagem, 3).
edge(d202, d203, 14).
edge(d202, d204, 20).
edge(d202, d205, 15).
edge(d202, d206, 11).
edge(d202, d2elevador, 5).

edge(d203, d201, 16).
edge(d203, d2passagem, 20).
edge(d203, d202, 6).
edge(d203, d204, 8).
edge(d203, d205, 14).
edge(d203, d206, 12).
edge(d203, d2elevador, 9).

edge(d204, d201, 15).
edge(d204, d2passagem, 4).
edge(d204, d202, 18).
edge(d204, d203, 23).
edge(d204, d205, 7).
edge(d204, d206, 10).
edge(d204, d2elevador, 12).

edge(d205, d201, 9).
edge(d205, d2passagem, 5).
edge(d205, d202, 14).
edge(d205, d203, 20).
edge(d205, d204, 8).
edge(d205, d206, 25).
edge(d205, d2elevador, 17).

edge(d206, d201, 22).
edge(d206, d2passagem, 3).
edge(d206, d202, 8).
edge(d206, d203, 6).
edge(d206, d204, 11).
edge(d206, d205, 18).
edge(d206, d2elevador, 14).

edge(d2elevador, d201, 7).
edge(d2elevador, d2passagem, 14).
edge(d2elevador, d202, 25).
edge(d2elevador, d203, 10).
edge(d2elevador, d204, 8).
edge(d2elevador, d205, 17).
edge(d2elevador, d206, 19).

edge(d301, d302, 24).
edge(d301, d303, 7).
edge(d301, d304, 4).
edge(d301, d305, 11).
edge(d301, d3passagemc3, 8).
edge(d301, d3passagemb2, 12).
edge(d301, d3elevador, 5).

edge(d3passagemc3, d302, 21).
edge(d3passagemc3, d303, 19).
edge(d3passagemc3, d304, 25).
edge(d3passagemc3, d305, 7).
edge(d3passagemc3, d301, 14).
edge(d3passagemc3, d3passagemb2, 10).
edge(d3passagemc3, d3elevador, 15).

edge(d3passagemb2, d302, 19).
edge(d3passagemb2, d303, 13).
edge(d3passagemb2, d304, 8).
edge(d3passagemb2, d305, 7).
edge(d3passagemb2, d301, 15).
edge(d3passagemb2, d3passagemc3, 20).
edge(d3passagemb2, d3elevador, 21).

edge(d302, d3passagemb2, 22).
edge(d302, d303, 9).
edge(d302, d304, 12).
edge(d302, d305, 15).
edge(d302, d301, 18).
edge(d302, d3passagemc3, 16).
edge(d302, d3elevador, 8).

edge(d303, d3passagemb2, 14).
edge(d303, d302, 5).
edge(d303, d304, 18).
edge(d303, d305, 20).
edge(d303, d301, 9).
edge(d303, d3passagemc3, 10).
edge(d303, d3elevador, 12).

edge(d304, d3passagemb2, 10).
edge(d304, d303, 18).
edge(d304, d302, 13).
edge(d304, d305, 11).
edge(d304, d301, 6).
edge(d304, d3passagemc3, 25).
edge(d304, d3elevador, 15).

edge(d305, d3passagemb2, 5).
edge(d305, d303, 20).
edge(d305, d302, 8).
edge(d305, d305, 4).
edge(d305, d301, 16).
edge(d305, d3passagemc3, 7).
edge(d305, d3elevador, 9).

edge(d3elevador, d3passagemb2, 14).
edge(d3elevador, d303, 18).
edge(d3elevador, d302, 20).
edge(d3elevador, d305, 22).
edge(d3elevador, d301, 15).
edge(d3elevador, d3passagemc3, 10).
edge(d3elevador, d305, 17).



edge(Node1, Node2, Cost) :-
    node(Node1, X1, Y1),
    node(Node2, X2, Y2),
    calculate_cost(X1, Y1, X2, Y2, Cost).

calculate_cost(X1, Y1, X2, Y2, Cost) :-
    node(Node1, X1, Y1),
    node(Node2, X2, Y2),
    ( is_elevator(Node1), is_elevator(Node2) -> Cost = 5         
    ; is_passage(Node1), is_passage(Node2) -> Cost = 30
    ; DX is abs(X1 - X2), DY is abs(Y1 - Y2),
      ( (DX =:= 1, DY =:= 0; DX =:= 0, DY =:= 1) -> Cost = 1 
      ; DX =:= 1, DY =:= 1 -> Cost = sqrt(2)
      )
    ).


is_elevator(Node) :-
    sub_atom(Node, _, _, _, 'elevador').


is_passage(Node) :-
    sub_atom(Node, _, _, _, 'passagem').


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