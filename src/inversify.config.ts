import "reflect-metadata";
import {Container, decorate, injectable} from "inversify";
import ChipsMeshPool from "@game/chips/ChipsMeshPool";
import {ChipFactory} from "@game/chips/ChipFactory";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {StakeModel} from "@game/StakeModel";
import {ChipsManager} from "@game/chips/ChipsManager";
import {CardTextureCache} from "@game/CardTextureCache";
import {Card3D} from "@game/cards/Card3D";
import {CoreTypes} from "./CoreTypes";
import {Table3D} from "@game/Table3D";
import {GameStartAction} from "@game/actions/GameStartAction";
import {SequenceAction} from "@core/actions/SequenceAction";
import {EventDispatcher} from "@core/events/EventDispatcher";
import * as EventEmitter from "eventemitter3";
import {SetupSceneAction} from "@game/actions/SetupSceneAction";
import {GameFlowManagerBJ} from "./managers/GameFlowManagerBJ";
import {UILayer} from "./ui/UILayer";
import {SetupUIAction} from "@game/actions/SetupUIAction";
import {ChipsPanel} from "@game/chips/ChipsPanel";
import {UpdateUIAction} from "@game/actions/UpdateUIAction";
import {BetUtilBJ} from "@game/utils/BetUtilBJ";
import {GameModel} from "@game/model/GameModelBJ";
import {HandsModel} from "@game/model/HandsModel";
import {BetModelBJ} from "@game/model/BetModelBJ";
import {DealerModel} from "@game/model/DealerModel";
import {PlaceBetAction} from "@game/actions/PlaceBetAction";
import {DealAction} from "@game/actions/DealAction";
import {InteractionManager} from "./managers/InteractionManager";
import {TransformNode} from "@babylonjs/core";
import {BlackjackCore} from "@game/model/blackjackcore/BlackjackCore";
import {HandNode} from "@game/HandNode";

export const di = new Container();

decorate(injectable(), EventEmitter);
decorate(injectable(), TransformNode);

di.bind(ChipsMeshPool).toSelf();
di.bind(ChipFactory).toSelf();
di.bind(ChipStackNode).toSelf();
di.bind(Card3D).toSelf();
di.bind(HandNode).toSelf();
di.bind(Table3D).toSelf().inSingletonScope();

di.bind(ChipsManager).toSelf().inSingletonScope();
di.bind(StakeModel).toSelf().inSingletonScope();
di.bind(CardTextureCache).toSelf().inSingletonScope();

di.bind(EventDispatcher).toSelf().inSingletonScope();
di.bind(SequenceAction).toSelf();



di.bind(HandsModel).toSelf().inSingletonScope(); //
di.bind(GameModel).toSelf().inSingletonScope(); //
di.bind(DealerModel).toSelf().inSingletonScope(); //
di.bind(BetUtilBJ).toSelf().inSingletonScope(); //
di.bind(BetModelBJ).toSelf().inSingletonScope(); //
di.bind(CoreTypes.gameFlowManager).to(GameFlowManagerBJ).inSingletonScope();
di.bind(DealAction).toSelf(); //
di.bind(PlaceBetAction).toSelf(); //
di.bind(UpdateUIAction).toSelf(); //

di.bind(CoreTypes.coreGame).to(BlackjackCore).inSingletonScope();


di.bind(UILayer).toSelf().inSingletonScope();
di.bind(SetupUIAction).toSelf();
di.bind(SetupSceneAction).toSelf();
di.bind(GameStartAction).toSelf();

di.bind(ChipsPanel).toSelf().inSingletonScope();


di.bind(InteractionManager).toSelf().inSingletonScope();

di.bind(CoreTypes.debug.fpsMeter).toDynamicValue(() => {
    return new FPSMeter(document.getElementById("fps-meter") as HTMLElement, {
        theme: "transparent",
        heat: 20,
        graph: 1,
        history: 20,
        zIndex: 100,
        top: "60px",
    });
}).inSingletonScope();