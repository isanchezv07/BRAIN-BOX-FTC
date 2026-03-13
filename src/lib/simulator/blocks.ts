import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

export function defineBlocks(blockly: typeof Blockly, generator: typeof javascriptGenerator) {
    (blockly.Blocks as Record<string, { init: () => void }> )['avanzar'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Avanzar')
            .appendField(new blockly.FieldNumber(0.5, 0.1, 10, 0.1), 'S')
            .appendField('s a potencia')
            .appendField(new blockly.FieldNumber(0.7, 0.1, 1, 0.1), 'P');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(160);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['avanzar'] = (b) => {
        const s = Number(b.getFieldValue('S'));
        const p = Number(b.getFieldValue('P'));
        return `window.robot.setPower(${p}, ${p}, ${p}, ${p});\nawait sleep(${(s * 1000) | 0});\nwindow.robot.stop();\n`;
    };

    (blockly.Blocks as Record<string, { init: () => void }> )['retroceder'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Retroceder')
            .appendField(new blockly.FieldNumber(0.5, 0.1, 10, 0.1), 'S')
            .appendField('s a potencia')
            .appendField(new blockly.FieldNumber(0.7, 0.1, 1, 0.1), 'P');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(160);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['retroceder'] = (b) => {
        const s = Number(b.getFieldValue('S'));
        const p = -Number(b.getFieldValue('P'));
        return `window.robot.setPower(${p}, ${p}, ${p}, ${p});\nawait sleep(${(s * 1000) | 0});\nwindow.robot.stop();\n`;
    };

    (blockly.Blocks as Record<string, { init: () => void }> )['girar'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Girar')
            .appendField(new blockly.FieldNumber(90, -360, 360, 15), 'DEG')
            .appendField('°');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(200);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['girar'] = (b) =>
        `await window.robot.turn(${Number(b.getFieldValue('DEG'))});\n`;

    (blockly.Blocks as Record<string, { init: () => void }> )['strafe'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Strafe')
            .appendField(new blockly.FieldDropdown([['Izquierda', 'L'], ['Derecha', 'R']]), 'DIR')
            .appendField(new blockly.FieldNumber(0.5, 0.1, 10, 0.1), 'S')
            .appendField('s a potencia')
            .appendField(new blockly.FieldNumber(0.7, 0.1, 1, 0.1), 'P');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(160);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['strafe'] = (b) => {
        const dir = b.getFieldValue('DIR') === 'L' ? -1 : 1;
        const s = Number(b.getFieldValue('S'));
        const p = Number(b.getFieldValue('P'));
        return `await window.robot.strafe(${dir * p}, ${(s * 1000) | 0});\n`;
    };

    (blockly.Blocks as Record<string, { init: () => void }> )['repeat_n'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Repetir')
            .appendField(new blockly.FieldNumber(4, 1, 100, 1), 'N')
            .appendField('veces');
          this.appendStatementInput('STACK').appendField('');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(140);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block, g: typeof javascriptGenerator) => string>)['repeat_n'] = (b, g) => {
        const n = Number(b.getFieldValue('N')) || 1;
        const body = g.statementToCode(b, 'STACK');
        const indented = body ? body.split('\n').map((l) => '  ' + l).join('\n') : '';
        return `for (let __i = 0; __i < ${n}; __i++) {\n${indented}\n}\n`;
    };

    (blockly.Blocks as Record<string, { init: () => void }> )['set_motors'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Motores FL:')
            .appendField(new blockly.FieldNumber(0, -1, 1, 0.1), 'FL')
            .appendField('FR:')
            .appendField(new blockly.FieldNumber(0, -1, 1, 0.1), 'FR')
            .appendField('BL:')
            .appendField(new blockly.FieldNumber(0, -1, 1, 0.1), 'BL')
            .appendField('BR:')
            .appendField(new blockly.FieldNumber(0, -1, 1, 0.1), 'BR');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(230);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['set_motors'] = (b) =>
        `window.robot.setPower(${b.getFieldValue('FL')}, ${b.getFieldValue('FR')}, ${b.getFieldValue('BL')}, ${b.getFieldValue('BR')});\n`;

    (blockly.Blocks as Record<string, { init: () => void }> )['set_motor_power'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Set motor')
            .appendField(new blockly.FieldDropdown([['FL', 'fl'], ['FR', 'fr'], ['BL', 'bl'], ['BR', 'br']]), 'MOTOR')
            .appendField('power')
            .appendField(new blockly.FieldNumber(0, -1, 1, 0.1), 'POWER');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(230);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['set_motor_power'] = (b) => {
        const motor = b.getFieldValue('MOTOR');
        const power = Number(b.getFieldValue('POWER'));
        let powers = [ 'fl', 'fr', 'bl', 'br' ].map(m => `window.robot.getPower('${m}')`);
        const motorIndex = ['fl', 'fr', 'bl', 'br'].indexOf(motor);
        powers[motorIndex] = `${power}`;
        return `window.robot.setPower(${powers.join(', ')});
`;
    };

    (blockly.Blocks as Record<string, { init: () => void }> )['get_motor_power'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Get motor power')
            .appendField(new blockly.FieldDropdown([['FL', 'fl'], ['FR', 'fr'], ['BL', 'bl'], ['BR', 'br']]), 'MOTOR');
          this.setOutput(true, 'Number');
          this.setColour(230);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => [string, number]>)['get_motor_power'] = (b) => {
        const motor = b.getFieldValue('MOTOR');
        return [`window.robot.getPower('${motor}')`, generator.ORDER_ATOMIC];
    };

    (blockly.Blocks as Record<string, { init: () => void }> )['get_yaw'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput().appendField('Get yaw');
          this.setOutput(true, 'Number');
          this.setColour(230);
        },
    };
        (generator.forBlock as Record<string, (b: Blockly.Block) => [string, number]>)['get_yaw'] = (b) => {
            return [`window.robot.getYaw()`, generator.ORDER_ATOMIC];
        };
    
        (blockly.Blocks as Record<string, { init: () => void }>)['get_distance'] = {
            init: function (this: Blockly.Block) {
              this.appendDummyInput().appendField('Get distance');
              this.setOutput(true, 'Number');
              this.setColour(230);
            },
        };
            (generator.forBlock as Record<string, (b: Blockly.Block) => [string, number]>)['get_distance'] = (b) => {
                return [`window.robot.getDistance()`, generator.ORDER_ATOMIC];
            };
        
            (blockly.Blocks as Record<string, { init: () => void }>)['get_color'] = {
                init: function (this: Blockly.Block) {
                  this.appendDummyInput().appendField('Get color');
                  this.setOutput(true, 'String');
                  this.setColour(230);
                },
            };
            (generator.forBlock as Record<string, (b: Blockly.Block) => [string, number]>)['get_color'] = (b) => {
                return [`window.robot.getColor()`, generator.ORDER_ATOMIC];
            };
        
            (blockly.Blocks as Record<string, { init: () => void }>)['wait_sec'] = {        init: function (this: Blockly.Block) {
          this.appendDummyInput()
            .appendField('Esperar')
            .appendField(new blockly.FieldNumber(1, 0.1, 60, 0.1), 'S')
            .appendField('s');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(120);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['wait_sec'] = (b) =>
        `await sleep(${(Number(b.getFieldValue('S')) * 1000) | 0});\n`;

    (blockly.Blocks as Record<string, { init: () => void }> )['stop_robot'] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput().appendField('STOP');
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(0);
        },
    };
    (generator.forBlock as Record<string, (b: Blockly.Block) => string>)['stop_robot'] = () =>
        `window.robot.stop();\n`;
}
