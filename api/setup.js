import koa from 'koa';
import { router } from './router.js';
import bodyparser  from 'koa-bodyparser';
import cors from '@koa/cors';

export const app = new koa();

app.use(cors());
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());