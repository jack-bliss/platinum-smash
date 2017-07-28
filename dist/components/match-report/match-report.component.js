"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const player_service_1 = require("../../services/player.service");
let MatchReportComponent = class MatchReportComponent {
    constructor(playerService, route) {
        this.playerService = playerService;
        this.route = route;
        this.loading = true;
    }
    ngOnInit() {
        this.route.params.subscribe(players => {
            // map ID strings to integers
            // let playerIDs = Object.entries(players).map(id => +id[1]);
            let playerIDs = [];
            for (var x in players) {
                playerIDs.push(players[x]);
            }
            // get both players
            Promise.all(playerIDs.map(id => this.playerService.getPlayer(id))).then(players => {
                this.player1 = players[0];
                this.player2 = players[1];
                this.loading = false;
            });
        });
    }
};
MatchReportComponent = __decorate([
    core_1.Component({
        selector: 'match-report',
        styleUrls: ['./match-report.style.scss'],
        templateUrl: 'match-report.template.html'
    }),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        router_1.ActivatedRoute])
], MatchReportComponent);
exports.MatchReportComponent = MatchReportComponent;
//# sourceMappingURL=match-report.component.js.map