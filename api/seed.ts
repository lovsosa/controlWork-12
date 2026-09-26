import mongoose from 'mongoose';
import path from 'path';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import config from './config';
import User from './models/User';
import Recipe from './models/Recipe';
import Comment from './models/Comment';

const fixtureImages = [
  'fixtures/plov.jpg',
  'fixtures/pelmeni.jpg',
  'fixtures/manty.jpg',
  'fixtures/lagman.webp',
  'fixtures/samsa.webp',
];

const run = async () => {
  const missing = fixtureImages.filter(
    (image) => !existsSync(path.join(config.publicPath, image)),
  );

  if (missing.length > 0) {
    console.warn('Не найдены картинки фикстур:', missing.join(', '));
  }

  await mongoose.connect(config.mongoDbUrl);
  const db = mongoose.connection;

  try {
    await db.dropCollection('comments');
    await db.dropCollection('recipes');
    await db.dropCollection('users');
  } catch {
    console.log('Collections were not present, skipping drop');
  }

  const [admin, cook, melis] = await User.create(
    {
      email: 'admin@recipes.kg',
      password: '123',
      displayName: 'admin',
      token: randomUUID(),
    },
    {
      email: 'imTheCook@recipes.kg',
      password: '123',
      displayName: 'heisenberg',
      token: randomUUID(),
    },
    {
      email: 'melis@recipes.kg',
      password: '123',
      displayName: 'melis',
      token: randomUUID(),
    },
  );

  const [plov, pelmeni, manty, lagman, samsa] = await Recipe.create(
    {
      title: 'Плов',
      description:
        'Ингредиенты: 1 кг баранины, 1 кг риса девзира, 1 кг моркови, 3 луковицы, 300 мл растительного масла, 2 головки чеснока, зира, барбарис, соль.\n\n' +
        '1. Раскалите масло в казане, обжарьте мясо крупными кусками до корочки.\n' +
        '2. Добавьте лук полукольцами, обжарьте до золотистого цвета.\n' +
        '3. Выложите морковь соломкой, жарьте 10 минут, не перемешивая.\n' +
        '4. Залейте кипятком, добавьте специи и соль, тушите 40 минут, это зирвак.\n' +
        '5. Выложите промытый рис ровным слоем, залейте водой на 1,5 см выше риса.\n' +
        '6. Когда вода впитается, вставьте чеснок, соберите рис горкой, накройте крышкой и томите 30 минут на слабом огне.',
      image: 'fixtures/plov.jpg',
      author: admin._id,
    },
    {
      title: 'Жареные пельмени',
      description:
        'Ингредиенты: 500 г пельменей, 2 ст. л. растительного масла, 1 луковица, 100 мл воды, сметана и зелень для подачи.\n\n' +
        '1. Разогрейте масло на сковороде и выложите замороженные пельмени в один слой.\n' +
        '2. Обжаривайте 3-4 минуты, пока низ не станет золотистым.\n' +
        '3. Добавьте нарезанный лук и влейте воду, сразу накройте крышкой.\n' +
        '4. Готовьте на среднем огне 8-10 минут, пока вода не выпарится.\n' +
        '5. Снимите крышку и дожарьте ещё 2 минуты до хрустящей корочки.\n' +
        '6. Подавайте со сметаной и зеленью.',
      image: 'fixtures/pelmeni.jpg',
      author: cook._id,
    },
    {
      title: 'Манты',
      description:
        'Тесто: 500 г муки, 250 мл воды, 1 яйцо, соль.\n' +
        'Начинка: 700 г баранины или говядины, 100 г курдючного жира, 4 луковицы, соль, чёрный перец, зира.\n\n' +
        '1. Замесите крутое тесто и оставьте под плёнкой на 30 минут.\n' +
        '2. Мясо, жир и лук мелко порубите ножом, посолите, поперчите, добавьте зиру.\n' +
        '3. Раскатайте тесто тонко, нарежьте квадратами 10×10 см.\n' +
        '4. Выложите начинку в центр, соедините противоположные углы и защипните края.\n' +
        '5. Смажьте ярусы мантоварки маслом, выложите манты.\n' +
        '6. Готовьте на пару 40-45 минут. Подавайте со сметаной или острым соусом.',
      image: 'fixtures/manty.jpg',
      author: cook._id,
    },
    {
      title: 'Лагман',
      description:
        'Ингредиенты: 500 г говядины, 500 г лапши для лагмана, 2 болгарских перца, 2 помидора, 1 луковица, 1 редька, 3 зубчика чеснока, 2 ст. л. томатной пасты, соль, перец.\n\n' +
        '1. Нарежьте мясо соломкой и обжарьте в казане на сильном огне.\n' +
        '2. Добавьте лук, затем перец, редьку и помидоры, нарезанные соломкой.\n' +
        '3. Вмешайте томатную пасту и чеснок, залейте водой и тушите 20 минут, это соус-ваджа.\n' +
        '4. Отварите лапшу в подсоленной воде и промойте.\n' +
        '5. Выложите лапшу в глубокую тарелку и полейте горячей ваджой.',
      image: 'fixtures/lagman.webp',
      author: cook._id,
    },
    {
      title: 'Самса',
      description:
        'Ингредиенты: 500 г слоёного теста, 500 г баранины, 2 луковицы, 50 г курдючного жира, 1 яйцо, кунжут, соль, зира.\n\n' +
        '1. Мясо, жир и лук нарежьте мелким кубиком, посолите и добавьте зиру.\n' +
        '2. Раскатайте тесто и нарежьте квадратами 12×12 см.\n' +
        '3. Выложите начинку и сверните треугольником, плотно защипнув края.\n' +
        '4. Смажьте яйцом и посыпьте кунжутом.\n' +
        '5. Выпекайте при 200 °C 30-35 минут до румяной корочки.',
      image: 'fixtures/samsa.webp',
      author: melis._id,
    },
  );

  await Comment.create(
    { text: 'Лучший плов, который я готовил! его рецепт чистый на 99.1 процент..', author: cook._id, recipe: plov._id },
    { text: 'А рис девзира обязательно или можно обычный?', author: melis._id, recipe: plov._id },
    { text: 'Как же я люблю жаренные пельмении)', author: melis._id, recipe: pelmeni._id },
    { text: 'Мне нравиться когда начинка с тыквой', author: admin._id, recipe: manty._id },
    { text: 'Соус получился яркий, спасибо за рецепт!', author: admin._id, recipe: lagman._id },
    { text: 'Самса как на базаре, очень вкусно.', author: cook._id, recipe: samsa._id },
    { text: 'Тесто лучше брать домашнее или магазинное подойдёт?', author: admin._id, recipe: samsa._id },
  );

  console.log('Database successfully seeded');
  await db.close();
};

run().catch(console.error);
