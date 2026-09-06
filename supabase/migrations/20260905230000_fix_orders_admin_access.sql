-- ============================================================
-- Fix: Admin access to all orders via SECURITY DEFINER RPC
-- This bypasses RLS so admins can always fetch all orders
-- ============================================================

-- Function to get all orders with items (admin only, bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_get_all_orders()
RETURNS SETOF json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  -- Verify caller is admin before returning data
  IF NOT (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'admin'
        OR raw_app_meta_data->>'role' = 'admin'
      )
    )
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT row_to_json(t)
  FROM (
    SELECT
      o.*,
      COALESCE(
        (
          SELECT json_agg(oi.*)
          FROM public.order_items oi
          WHERE oi.order_id = o.id
        ),
        '[]'::json
      ) AS order_items
    FROM public.orders o
    ORDER BY o.created_at DESC
  ) t;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_all_orders() TO authenticated;
