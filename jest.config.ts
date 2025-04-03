/**
 * Jest Configuration for TypeScript projects using ts-jest
 * For more details, visit: https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest', // Используем ts-jest для тестирования TypeScript
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        //tsconfig: 'tsconfig.json', // Путь к tsconfig.json (можно поменять)
        //diagnostics: true, // Показывать ошибки TypeScript в тестах
      },
    ],
  },
  //testEnvironment: 'node', // Или 'jsdom', если тестируешь React-компоненты
  //collectCoverage: true, // Включаем сбор покрытия кода тестами
  //coverageDirectory: 'coverage', // Куда сохранять отчеты о покрытии
  //moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Какие расширения файлов использовать
};

export default config;
