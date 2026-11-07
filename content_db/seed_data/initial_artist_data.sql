-- 董小姐 (M98) 初始数据
INSERT INTO artists (artist_id, name, bio, monthly_listeners, total_plays) 
VALUES (
  'M98', 
  '董小姐', 
  '电子音乐制作人，融合东方传统音乐元素与现代电子音乐，创造独特的"东方未来之声"风格。',
  128000, 
  2400000
);

-- 代表作品
INSERT INTO releases (title, artist_id, release_date, type) 
VALUES 
  ('量子禅', 'M98', '2023-05-20', 'album'),
  ('机械心跳', 'M98', '2024-02-14', 'single'),
  ('数字河流 (Remix)', 'M98', '2024-04-30', 'remix');

-- 独家内容
INSERT INTO exclusive_content (title, artist_id, content_type, release_date)
VALUES
  ('幕后制作: 量子禅', 'M98', 'video', '2023-06-15'),
  ('2024巡演预告', 'M98', 'video', '2024-03-01'),
  ('未发布Demo集', 'M98', 'audio', '2024-05-10');
