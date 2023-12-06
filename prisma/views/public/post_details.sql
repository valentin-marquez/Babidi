SELECT
  row_number() OVER (
    ORDER BY
      p.post_id
  ) AS id,
  p.post_id,
  p.title,
  p.description,
  p.author_id,
  p.created_at,
  p.status,
  p.updated_at,
  p.slug,
  string_agg((pi.image_url) :: text, ',' :: text) AS image_urls,
  pr.full_name,
  pr.username,
  c.name AS category_name,
  c.slug AS category_slug
FROM
  (
    (
      (
        posts p
        LEFT JOIN post_images pi ON ((p.post_id = pi.post_id))
      )
      LEFT JOIN profiles pr ON ((p.author_id = pr.user_id))
    )
    LEFT JOIN categories c ON ((p.category_id = c.category_id))
  )
GROUP BY
  p.post_id,
  pr.user_id,
  c.category_id;