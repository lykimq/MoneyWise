(** Check command module for MoneyWise CLI *)

open Cmdliner

(** Import the prerequisites module *)
open Prerequisites

(** Check command implementation *)
let check_cmd =
  let doc = "Check project prerequisites and status" in
  let man = [
    `S Manpage.s_description;
    `P "Checks project prerequisites and current status after setup.";
    `S Manpage.s_examples;
    `P "$(mname) check";
  ] in
  let check : unit -> unit = fun () ->
    Printf.printf "🔍 Checking MoneyWise project prerequisites and status...\n";

    (* Phase 1: Prerequisites Verification (Already Implemented) *)
    Printf.printf "✅ Phase 1: Prerequisites Verification\n";
    let status = Prerequisites.check_all_prerequisites () in
    Prerequisites.display_prerequisites_status status;

    (* TODO: Phase 2: Environment Configuration Validation *)
    Printf.printf "⚙️  Phase 2: Environment Configuration Validation\n";
    (* TODO: Validate .env file exists and has required variables *)
    (* TODO: Check Supabase credentials are configured (from scripts/setup/get-supabase-credentials.sh) *)
    (* TODO: Verify environment configuration is complete (from scripts/setup/env-manager.sh) *)

    (* TODO: Phase 3: Database Connection Validation *)
    Printf.printf "🗄️  Phase 3: Database Connection Validation\n";
    (* TODO: Test database connection *)
    (* TODO: Verify database schema exists (from scripts/database/schema-manager.sh) *)
    (* TODO: Check database migrations are up to date *)

    (* TODO: Phase 4: Service Health Validation *)
    Printf.printf "🔧 Phase 4: Service Health Validation\n";
    (* TODO: Check PostgreSQL service is running (from scripts/setup/service-manager.sh) *)
    (* TODO: Check Redis service is running (from scripts/setup/service-manager.sh) *)
    (* TODO: Verify all required services are healthy *)

    (* TODO: Phase 5: Test Environment Validation *)
    Printf.printf "🧪 Phase 5: Test Environment Validation\n";
    (* TODO: Verify test database is accessible *)
    (* TODO: Check test configuration is correct *)
    (* TODO: Validate test environment setup (from scripts/testing/test-schema-manager.sh) *)

    (* TODO: Phase 6: Monitoring Setup Validation *)
    Printf.printf "📊 Phase 6: Monitoring Setup Validation\n";
    (* TODO: Check monitoring tools are configured *)
    (* TODO: Verify logging is working *)
    (* TODO: Test alerting systems (from scripts/quick-check.sh) *)

    (* Return appropriate exit code *)
    if status.failed_checks > 0 then
      exit 1
    else
      exit 0
  in
  Cmd.v (Cmd.info "check" ~doc ~man) (Term.(const check $ const ()))
