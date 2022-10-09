import Router from '@koa/router'
import * as users from './app/users/index.js'
import * as hunches from './app/hunches/index.js'
import * as games from './app/games/index.js'

export const router = new Router()

router.get('/games', games.listGames);
router.post('/users', users.create);
router.get('/users', users.listUsers);
router.get('/login', users.login);
router.get('/:username', users.listHunches);
router.post('/hunches', hunches.create);