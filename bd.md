-- ===============================
-- 🎯 PALHA ITALIANA — SISTEMA DE VENDAS
-- ===============================

-- Usuários (clientes)
create table usuarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique,
  criado_em timestamptz default now()
);

-- Vendedores
create table vendedores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique,
  criado_em timestamptz default now()
);

-- Compras
create table compras (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references usuarios(id) on delete cascade,
  vendedor_id uuid references vendedores(id) on delete set null,
  quantidade int not null check (quantidade > 0),
  valor_total numeric(10,2) not null,
  bonus int default 0,
  status text check (status in ('pendente','confirmado','rejeitado')) default 'pendente',
  confirmado_por uuid references vendedores(id),
  criado_em timestamptz default now(),
  confirmado_em timestamptz
);

-- Pontos de fidelidade (para promoções e brindes)
create table pontos_fidelidade (
  usuario_id uuid primary key references usuarios(id) on delete cascade,
  total_pontos int default 0,
  atualizado_em timestamptz default now()
);

-- Trigger para atualizar pontos quando compra confirmada
create or replace function atualizar_pontos()
returns trigger as $$
begin
  if new.status = 'confirmado' then
    insert into pontos_fidelidade(usuario_id, total_pontos)
    values (new.usuario_id, new.quantidade + coalesce(new.bonus,0))
    on conflict (usuario_id)
    do update set total_pontos = pontos_fidelidade.total_pontos + (new.quantidade + coalesce(new.bonus,0)),
                  atualizado_em = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_atualizar_pontos
after update on compras
for each row
when (old.status is distinct from new.status)
execute function atualizar_pontos();

-- View para facilitar o dashboard do vendedor
create view resumo_vendas as
select
  v.nome as vendedor,
  count(c.id) as total_vendas,
  sum(c.valor_total) as total_recebido,
  sum(c.bonus) as brindes_dados
from compras c
left join vendedores v on v.id = c.vendedor_id
where c.status = 'confirmado'
group by v.nome;
