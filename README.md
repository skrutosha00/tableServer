## Базы данных в Psibase

На данный момент был реализован бэкап трёх таблиц по всем премиум ботам:
- Пользователи
- Игры
- Ходы

Между базами записи перемещаются с помощью отдельного сервиса на NodeJS (проект table-server в heroku) с интервалом в 10 минут. Копирование всех 12 таблиц (у каждого бота свой набор таблиц) занимает около 7 минут.

### Посмотреть данные

Все таблицы могут быть получены по ссылкам, однако Psibase не может показать их целиком. Поэтому нужно ограничивать количество записей на получение в самом запросе. В примерах ниже база отправляет первые 50 записей таблиц.

<a href="https://userback.royfractal.com/graphql?query={user_rows(first:50){edges{node{id,pg_id,tg_id,language_code,creation_date,username,first_name,last_name,glize_attached_address,glize_balance,full_game_paid,is_direct_registration,is_top_leader,leader_tg_id,is_finishing,bot_type}}}}">Пользователи</a>

<a href="https://gameback.royfractal.com/graphql?query={game_rows(first:50){edges{node{id,pg_id,user_id,user_tg_id,is_demo,type,token,is_active,step_count,position,last_move_time,ingame,invested,payout,guides_payout,devs_payout,sigen_payout,marketing_payout,winners_payout,forum_payout,liquidity_payout,apple_payout,auto_payout,market_makers_payout,salary_payout,investors_payout,housing_payout,payout_transaction,guides_payout_transaction,devs_payout_transaction,sigen_payout_transaction,marketing_payout_transaction,winners_payout_transaction,forum_payout_transaction,liquidity_payout_transaction,apple_payout_transaction,auto_payout_transaction,market_makers_payout_transaction,salary_payout_transaction,investors_payout_transaction,housing_payout_transaction,collected,started_time,limit,bot_type}}}}
">Игры</a>

<a href="https://moveback.royfractal.com/graphql?query={move_rows(first:50){edges{node{id,pg_id,game_id,position,game_step,raw_value,current_game_value,time,ingame,invested,bot_type}}}}
">Ходы</a>

### Как получить записи?

Записи предоставляются по GET запросу вида:\
https:\/\/[имя сервиса].[имя домена]/graphql?query=\{[имя функции вызова][функция]{edges{node{[столбец1],[столбец2]}}}}

Пример запроса, который получает адрес пользователей с id большим чем 5000, но меньшим чем 5250: \
<b>https:\/\/userback.royfractal.com/graphql?query={user_rows(ge:5000,le:5250){edges{node{glize_attached_address}}}}</b>

### Поддерживаемые функции

Все функции могут применяться только к значению поля id.

- gt - больше
- ge - больше или равно
- lt - меньше
- le - меньше или равно
- first - первые значения в таблице
- last - последние значения в таблице

### Столбцы таблиц

Список столбцов полностью повторяется за оригинальной базой данных, однако поле id теперь указывает на индекс записи, pg_id на id из исходных данных. Также добавляется поле bot_type для определения типа бота

#### Пользователи

- id
- pg_id
- tg_id
- language_code
- creation_date
- username
- first_name
- last_name 
- glize_attached_address 
- glize_balance
- full_game_paid
- is_direct_registration
- is_top_leader
- leader_tg_id
- is_finishing
- bot_type

#### Игры

- id
- pg_id
- user_id
- user_tg_id
- is_demo
- type,token
- is_active
- step_count
- position
- last_move_time
- ingame
- invested
- payout
- guides_payout
- devs_payout
- sigen_payout
- marketing_payout
- winners_payout
- forum_payout
- liquidity_payout
- apple_payout
- auto_payout
- market_makers_payout
- salary_payout
- investors_payout
- housing_payout
- payout_transaction
- guides_payout_transaction
- devs_payout_transaction
- sigen_payout_transaction
- marketing_payout_transaction
- winners_payout_transaction
- forum_payout_transaction
- liquidity_payout_transaction
- apple_payout_transaction
- auto_payout_transaction
- market_makers_payout_transaction
- salary_payout_transaction
- investors_payout_transaction
- housing_payout_transaction
- collected
- started_time
- limit
- bot_type

#### Ходы

- id
- pg_id
- game_id
- position
- game_step
- raw_value
- current_game_value
- time
- ingame
- invested
- bot_type




