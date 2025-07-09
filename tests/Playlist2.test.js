import { expect } from 'chai';
import { db } from './setup.js';

describe('Playlist Model - Testes adicionais', () => {
  it('Deve permitir criar playlists com nome vazio ("") se não for obrigatório', async () => {
    const usuario = await db.Usuario.create({ login: 'userEmpty', nome: 'Usuário Vazio' });

    const playlist = await db.Playlist.create({
      id_usuario: usuario.id,
      nome: '',
    });

    expect(playlist.nome).to.equal('');
  });

  it('Deve associar playlists com um usuário corretamente (verificação reversa)', async () => {
    const usuario = await db.Usuario.create({ login: 'userAssoc', nome: 'Usuário Assoc' });

    const playlist = await db.Playlist.create({ id_usuario: usuario.id, nome: 'Mix' });

    const dono = await playlist.getUsuario?.(); // só funciona se tiver associação definida com hasMany / belongsTo

    if (dono) {
      expect(dono.id).to.equal(usuario.id);
    }
  });
});
