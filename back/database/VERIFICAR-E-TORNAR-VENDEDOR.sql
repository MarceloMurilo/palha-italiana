-- ========================================
-- 🔍 VERIFICAR SE É VENDEDOR
-- ========================================

-- 1️⃣ Verificar dados do usuário no Auth
SELECT 
  id,
  email,
  raw_user_meta_data->>'is_vendedor' as is_vendedor,
  raw_user_meta_data->>'nome' as nome,
  created_at
FROM auth.users
WHERE email = 'marcelomurilotrabalho@gmail.com';

-- 2️⃣ Verificar se está na tabela vendedores
SELECT *
FROM vendedores
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'marcelomurilotrabalho@gmail.com'
);


-- ========================================
-- ✅ TORNAR VENDEDOR (se não for)
-- ========================================

-- 3️⃣ Inserir na tabela vendedores
INSERT INTO vendedores (id, nome, email)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'nome', email),
  email
FROM auth.users
WHERE email = 'marcelomurilotrabalho@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- 4️⃣ Atualizar metadados do usuário (marcando como vendedor)
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"is_vendedor": true}'::jsonb
    ELSE raw_user_meta_data || '{"is_vendedor": true}'::jsonb
  END
WHERE email = 'marcelomurilotrabalho@gmail.com';


-- ========================================
-- 🔄 VERIFICAR NOVAMENTE (após correção)
-- ========================================

-- 5️⃣ Confirmar que agora é vendedor
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'is_vendedor' as is_vendedor,
  v.nome as vendedor_nome,
  v.criado_em
FROM auth.users u
LEFT JOIN vendedores v ON v.id = u.id
WHERE u.email = 'marcelomurilotrabalho@gmail.com';


-- ========================================
-- 📊 VERIFICAR TODOS OS VENDEDORES
-- ========================================

-- 6️⃣ Listar todos os vendedores cadastrados
SELECT 
  v.id,
  v.nome,
  v.email,
  u.raw_user_meta_data->>'is_vendedor' as is_vendedor,
  v.criado_em
FROM vendedores v
JOIN auth.users u ON u.id = v.id
ORDER BY v.criado_em DESC;

