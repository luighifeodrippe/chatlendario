drop policy "Allow view access to non-private assistants" on "public"."assistants";

drop policy "Allow full access to own prompt_workspaces" on "public"."prompt_workspaces";

drop policy "Allow view access to non-private prompts" on "public"."prompts";

drop policy "Allow view access to non-private workspaces" on "public"."workspaces";

alter table "public"."profiles" drop constraint "profiles_user_id_fkey";

alter table "public"."profiles" add column "last_timeout" timestamp with time zone;

alter table "public"."workspaces" add column "user_role" text;

alter table "public"."profiles" add constraint "public_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "public_profiles_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public."Delete_teste"()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
    DELETE FROM auth.users
    WHERE email = 'pelainteligencia@gmail.com';
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_profile_and_workspace()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
    random_username TEXT;
BEGIN
    -- Generate a random username
    random_username := 'user' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16);

    -- Create a profile for the new user
    INSERT INTO public.profiles(user_id, anthropic_api_key, azure_openai_35_turbo_id, azure_openai_45_turbo_id, azure_openai_45_vision_id, azure_openai_api_key, azure_openai_endpoint, google_gemini_api_key, has_onboarded, image_url, image_path, mistral_api_key, display_name, bio, openai_api_key, openai_organization_id, perplexity_api_key, profile_context, use_azure_openai, username)
    VALUES(
        NEW.id,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        FALSE,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        FALSE,
        random_username
    );

    INSERT INTO public.workspaces(user_id, is_home, name, default_context_length, default_model, default_prompt, default_temperature, description, embeddings_provider, include_profile_context, include_workspace_instructions, instructions)
    VALUES(
        NEW.id,
        TRUE,
        'AI',
        4096,
        'gpt-4-turbo-preview', -- Updated default model
        'You are a friendly, helpful AI assistant.',
        0.5,
        'My home workspace.',
        'openai',
        TRUE,
        TRUE,
        '' );

    RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.delete_storage_object(bucket text, object text, OUT status integer, OUT content text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  project_url TEXT := 'https://uenhbdjjocdhutlccbhu.supabase.co';
  service_role_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'; -- full access needed for http request to storage
  url TEXT := project_url || '/storage/v1/object/' || bucket || '/' || object;
BEGIN
  SELECT
      INTO status, content
           result.status::INT, result.content::TEXT
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer ' || service_role_key)],
    NULL,
    NULL)::extensions.http_request) AS result;
END;$function$
;

create policy "share_assistant_collections"
on "public"."assistant_collections"
as permissive
for select
to public
using ((1 = 1));


create policy "share_assistants_policy"
on "public"."assistant_workspaces"
as permissive
for select
to public
using ((1 = 1));


create policy "share_folders_policy"
on "public"."folders"
as permissive
for select
to public
using (((workspace_id = '1d2eb2ce-8a97-4bcd-afde-e4b2da30be77'::uuid) AND (user_id = '62086780-40f8-4d1e-b91e-3cc5a05b48dc'::uuid)));


create policy "share_prompt_workspace_policy"
on "public"."prompt_workspaces"
as permissive
for select
to public
using ((1 = 1));


create policy "Allow view access to non-private assistants"
on "public"."assistants"
as permissive
for select
to public
using (((sharing <> 'private'::text) OR (user_id = '62086780-40f8-4d1e-b91e-3cc5a05b48dc'::uuid)));


create policy "Allow full access to own prompt_workspaces"
on "public"."prompt_workspaces"
as permissive
for all
to public
using (((user_id = auth.uid()) OR (workspace_id = '1d2eb2ce-8a97-4bcd-afde-e4b2da30be77'::uuid)))
with check (((user_id = auth.uid()) OR (workspace_id = '1d2eb2ce-8a97-4bcd-afde-e4b2da30be77'::uuid)));


create policy "Allow view access to non-private prompts"
on "public"."prompts"
as permissive
for select
to public
using (((sharing <> 'private'::text) OR (user_id = '62086780-40f8-4d1e-b91e-3cc5a05b48dc'::uuid)));


create policy "Allow view access to non-private workspaces"
on "public"."workspaces"
as permissive
for select
to public
using ((1 = 1));



