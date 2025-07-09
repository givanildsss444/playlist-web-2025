import { expect } from 'chai';
import { db } from './setup.js';

describe('PlaylistFilme Model', () => {
  it('Deve criar um PlaylistFilme com dados válidos', async () => {
    const usuario = await db.Usuario.create({ login: 'usuario123', nome: 'Usuário Teste' });

    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Minha Playlist' });

    const canal = await db.Canal.create({
      nome: 'Canal Teste',
      data_criacao: new Date('2023-01-01'),
      genero_tema: 'Ação',
    });

    const filme = await db.Filme.create({
      titulo: 'Filme Teste',
      genero: 'Ação',
      duracao: 120,
      ano_lancamento: 2022,
    });

    const playlistFilme = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_canal: canal.id,
      id_filme: filme.id,
      assistido: true,
      tempo_assistido: 1200,
      data_visualizacao: new Date('2024-05-10'),
      nota_avaliacao_usuario: 4,
    });

    expect(playlistFilme).to.have.property('id');
    expect(playlistFilme.id_playlist).to.equal(playlist.id);
    expect(playlistFilme.id_canal).to.equal(canal.id);
    expect(playlistFilme.id_filme).to.equal(filme.id);
    expect(playlistFilme.assistido).to.be.true;
    expect(playlistFilme.tempo_assistido).to.equal(1200);
    expect(playlistFilme.data_visualizacao).to.be.instanceOf(Date);
    expect(playlistFilme.nota_avaliacao_usuario).to.equal(4);
  });

  it('Não deve criar PlaylistFilme sem id_playlist', async () => {
    const filme = await db.Filme.create({
      titulo: 'Filme Sem Playlist',
      genero: 'Drama',
      duracao: 90,
      ano_lancamento: 2020,
    });

    try {
      await db.PlaylistFilme.create({
        id_filme: filme.id,
      });
      expect.fail('Deveria ter lançado um erro de validação');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Não deve aceitar nota fora do intervalo de 1 a 5', async () => {
    const usuario = await db.Usuario.create({ login: 'usuY', nome: 'Usuário Y' });
    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Playlist Y' });
    const filme = await db.Filme.create({
      titulo: 'Filme Y',
      genero: 'Comédia',
      duracao: 100,
      ano_lancamento: 2021,
    });

    try {
      await db.PlaylistFilme.create({
        id_playlist: playlist.id,
        id_filme: filme.id,
        nota_avaliacao_usuario: 6,
      });
      expect.fail('Deveria ter lançado erro por nota inválida');
    } catch (error) {
      expect(error.name).to.equal('SequelizeValidationError');
    }
  });

  it('Deve atribuir valores padrão para campos opcionais', async () => {
    const usuario = await db.Usuario.create({ login: 'usuZ', nome: 'Usuário Z' });
    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Playlist Z' });
    const filme = await db.Filme.create({
      titulo: 'Filme Z',
      genero: 'Suspense',
      duracao: 110,
      ano_lancamento: 2023,
    });

    const playlistFilme = await db.PlaylistFilme.create({
      id_playlist: playlist.id,
      id_filme: filme.id,
    });

    expect(playlistFilme.assistido).to.be.false;
    expect(playlistFilme.tempo_assistido).to.equal(0);
    expect(playlistFilme.data_visualizacao).to.be.null;
    expect(playlistFilme.nota_avaliacao_usuario).to.be.null;
  });
});
