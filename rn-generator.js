const { program } = require('commander');
const fs = require('fs');
const { exit } = require('process');

const generateComponent = (componentName, allowExtentions) => {
    return `import React from 'react';
import { Text } from 'react-native';
import { T${componentName}Props } from './types${allowExtentions ? '.ts' : ''}';
import { MainView } from './styled${allowExtentions ? '.ts' : ''}';

export const ${componentName} = ({ prop }: T${componentName}Props) => {
    return (
        <MainView>
            <Text>Hello, {prop}, from generator!</Text>
        </MainView>
    );
};
`;
};

const generateStyled = () => {
    return `import { View } from 'react-native';
import styled from 'styled-components';

export const MainView = styled(View)\`
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    align-items: center;
    justify-content: center;
\`;
`;
};

const generateTypes = componentName => {
    return `export type T${componentName}Props = {
    prop: any;
};
`;
};

const generateIndex = (componentName, allowExtentions) => {
    return `export * from './${componentName}${allowExtentions ? '.tsx' : ''}';
`;
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

program
    .name('rn-generator')
    .description('A compoent generator for React Native.');

program
    .option(
        '--path <path to the folder where to generate>',
        'select a folder where to generate component. Create one if doesnt exits',
    )
    .option(
        '--component <component name>',
        'create a folder and component with provided name from capital letter',
    )
    // .option('-f', 'fill generated files with start code')
    .option('-e', 'use imports with extentions (.tsx)')
    .parse();

const options = program.opts();

if (options.path && options.component) {
    if (!fs.existsSync(options.path)) {
        console.error(`Folder ${options.path} doesn't exist! `);
        console.log('Trying to create folder...');
        fs.mkdirSync(options.path, { recursive: true });
    }

    // component
    fs.writeFile(
        `${options.path}/${capitalizeFirstLetter(options.component)}.tsx`,
        generateComponent(capitalizeFirstLetter(options.component), options.e),
        error => {
            if (error) {
                console.log(error);
                exit;
            }
            console.log(
                `✅ ${options.path}/${capitalizeFirstLetter(
                    options.component,
                )}.tsx created successful.`,
            );
        },
    );

    // styled
    fs.writeFile(`${options.path}/styled.ts`, generateStyled(), error => {
        if (error) {
            return console.log(error);
        }
        console.log(`✅ ${options.path}/styled.ts created successful.`);
    });

    // types
    fs.writeFile(
        `${options.path}/types.ts`,
        generateTypes(capitalizeFirstLetter(options.component)),
        error => {
            if (error) {
                return console.log(error);
            }
            console.log(`✅ ${options.path}/types.ts created successful.`);
        },
    );

    // index
    fs.writeFile(
        `${options.path}/index.ts`,
        generateIndex(capitalizeFirstLetter(options.component), options.e),
        error => {
            if (error) {
                return console.log(error);
            }
            console.log(`✅ ${options.path}/index.ts created successful.`);
        },
    );
}
