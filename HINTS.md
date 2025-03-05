В macOS

Найдите, какой пользователь уже существует (обычно это ваш системный пользователь):
bashCopypsql -l

Если эта команда работает, запомните имя пользователя, с которым подключились.
Войдите в PostgreSQL с существующим пользователем:
bashCopypsql postgres

Или, если знаете другого пользователя:
bashCopypsql -U имя_пользователя postgres

Создайте роль postgres:
sqlCopyCREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'yourpassword';