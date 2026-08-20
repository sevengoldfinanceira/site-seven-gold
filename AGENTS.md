# Regras de publicação

- Quando o usuário pedir para subir, enviar ou publicar uma alteração, o trabalho deve terminar publicado em produção.
- Preserve o fluxo de segurança por branch e pull request, mas não encerre a tarefa com a Vercel em `Preview`: após as verificações, deixe a pull request pronta, faça o merge na `main` e confirme o deploy `Production`.
- Só mantenha uma alteração exclusivamente em preview quando o usuário pedir isso de forma explícita.
- Antes de informar que a publicação terminou, confirme que a `main` contém o commit e que o deploy de produção foi concluído com sucesso.
