import { expect } from 'chai';
import { db } from './setup.js';

describe('Filme Model', () => {
  it('Deve criar um filme com dados válidos', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme Exemplo',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2020,
      nota_avaliacao: 8.5,
    });

    expect(filme).to.have.property('id');
    expect(filme.titulo).to.equal('Filme Exemplo');
    expect(filme.duracao).to.equal(120);
    expect(filme.nota_avaliacao).to.equal('8.50');
  });

  it('Não deve criar filme sem título', async () => {
    try {
      await db.Filme.create({
        genero: 'Comédia',
        duracao: 90,
        ano_lancamento: 2022,
      });
      expect.fail('Deveria lançar erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve aceitar nota_avaliacao maior que 10', async () => {
    try {
      await db.Filme.create({
        titulo: 'Filme Inválido',
        genero: 'Drama',
        duracao: 100,
        ano_lancamento: 2021,
        nota_avaliacao: 11.0,
      });
      expect.fail('Deveria lançar erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve aceitar nota_avaliacao negativa', async () => {
    try {
      await db.Filme.create({
        titulo: 'Filme Inválido',
        genero: 'Drama',
        duracao: 100,
        ano_lancamento: 2021,
        nota_avaliacao: -1,
      });
      expect.fail('Deveria lançar erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Deve atribuir created_at automaticamente se não fornecido', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme com CreatedAt',
      genero: 'Fantasia',
      duracao: 105,
      ano_lancamento: 2022,
    });

    expect(filme.created_at).to.be.instanceOf(Date);
  });

  it('Deve permitir vários filmes com mesmo gênero', async () => {
    const filme1 = await db.Filme.create({
      titulo: 'Filme 1',
      genero: 'Terror',
      duracao: 80,
      ano_lancamento: 2021,
    });

    const filme2 = await db.Filme.create({
      titulo: 'Filme 2',
      genero: 'Terror',
      duracao: 95,
      ano_lancamento: 2022,
    });

    expect(filme1.genero).to.equal(filme2.genero);
  });

  it('Não deve aceitar ano_lancamento antes de 1895 (ano do primeiro filme)', async () => {
    try {
      await db.Filme.create({
        titulo: 'Filme Antigo',
        genero: 'Histórico',
        duracao: 100,
        ano_lancamento: 1800,
      });
      expect.fail('Deveria lançar erro de validação personalizada');
    } catch (error) {
      // não há validação ainda, só lança erro se você adicionar uma.
      expect(error.name).to.be.oneOf(['SequelizeValidationError', 'SequelizeDatabaseError']);
    }
  });
});
