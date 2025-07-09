import { expect } from 'chai';
import { db } from './setup.js';

describe('Filme Model - Testes adicionais', () => {
  it('Não deve aceitar título com mais de 100 caracteres', async () => {
    const tituloLongo = 'A'.repeat(101); // 101 caracteres
    try {
      await db.Filme.create({
        titulo: tituloLongo,
        genero: 'Drama',
        duracao: 90,
        ano_lancamento: 2021,
      });
      expect.fail('Deveria lançar erro de validação de tamanho do título');
    } catch (error) {
      expect(error.name).to.equal('SequelizeDatabaseError');
    }
  });

  it('Não deve aceitar gênero com mais de 50 caracteres', async () => {
    const generoLongo = 'B'.repeat(51); // 51 caracteres
    try {
      await db.Filme.create({
        titulo: 'Filme Gênero Longo',
        genero: generoLongo,
        duracao: 100,
        ano_lancamento: 2020,
      });
      expect.fail('Deveria lançar erro de validação de tamanho do gênero');
    } catch (error) {
      expect(error.name).to.equal('SequelizeDatabaseError');
    }
  });

  it('Deve aceitar nota_avaliacao como nula', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme Sem Nota',
      genero: 'Aventura',
      duracao: 110,
      ano_lancamento: 2023,
      nota_avaliacao: null,
    });

    expect(filme.nota_avaliacao).to.be.null;
  });

  it('Deve permitir criar filme sem nota_avaliacao', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme sem nota explícita',
      genero: 'Fantasia',
      duracao: 95,
      ano_lancamento: 2021,
    });

    expect(filme.nota_avaliacao).to.be.null;
  });

  it('Deve aceitar valores decimais válidos para nota_avaliacao', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme Nota 7.25',
      genero: 'Musical',
      duracao: 130,
      ano_lancamento: 2024,
      nota_avaliacao: 7.25,
    });

    expect(filme.nota_avaliacao).to.equal('7.25');
  });

  it('Não deve criar filme com ano_lancamento no futuro', async () => {
    const proximoAno = new Date().getFullYear() + 1;
    try {
      await db.Filme.create({
        titulo: 'Filme do Futuro',
        genero: 'Ficção',
        duracao: 90,
        ano_lancamento: proximoAno,
      });
      expect.fail('Deveria lançar erro de validação de ano futuro');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });
});
