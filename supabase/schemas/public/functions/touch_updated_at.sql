CREATE OR REPLACE FUNCTION public.touch_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO 'public'
  AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

GRANT EXECUTE ON FUNCTION "public"."touch_updated_at"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";
