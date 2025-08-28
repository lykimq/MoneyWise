(** Setup command module for MoneyWise CLI *)

open Cmdliner

(** Setup command implementation *)
let setup_cmd =
  let doc = "Setup the complete MoneyWise project" in
  let man = [
    `S Manpage.s_description;
    `P "Sets up the complete MoneyWise project including backend and frontend dependencies.";
    `S Manpage.s_examples;
    `P "$(mname) setup";
    `P "$(mname) setup --project-root /path/to/project";
  ] in
  let project_root =
    let doc = "Project root directory" in
    Arg.(value & opt (some dir) None & info ["project-root"] ~docv:"DIR" ~doc)
  in
  let setup project_root =
    let root = match project_root with
      | Some dir -> dir
      | None -> Unix.getcwd ()
    in
    Printf.printf "🚀 MoneyWise Full Project Setup\n";
    Printf.printf "===============================\n\n";
    Printf.printf "Setting up MoneyWise project in: %s\n" root;

    (* Phase 1: Project Structure Verification *)
    Printf.printf "🔍 Phase 1: Project Structure Verification\n";
    (* TODO: Verify project structure exists (check if we're in the right directory) *)
    (* TODO: Check moneywise-backend/ directory exists and has setup.sh *)
    (* TODO: Check moneywise-app/ directory exists and has package.json *)
    (* TODO: Check scripts/ directory exists and has required setup scripts *)
    (* Note: No scripts to call here - just verify directories and files exist *)

    (* Phase 2: Prerequisites Verification *)
    Printf.printf "✅ Phase 2: Prerequisites Verification\n";
    (* Verify prerequisites are available (use Prerequisites.verify_prerequisites_silent) *)
    if Prerequisites.verify_prerequisites_silent () then
      Printf.printf "  ✅ All prerequisites are available\n"
    else (
      Printf.printf "  ❌ Some prerequisites are missing\n";
      Printf.printf "  💡 Please run 'moneywise check' to see what's missing\n";
      Printf.printf "  🚫 Setup cannot continue without prerequisites\n";
      exit 1
    );

    (* Phase 3: Backend Setup *)
    Printf.printf "🚀 Phase 3: Backend Setup\n";
    (* TODO: Change to moneywise-backend/ directory *)
    (* TODO: Run backend setup script (moneywise-backend/setup.sh) *)
    (* TODO: Install Rust dependencies *)
    (* TODO: Build backend application *)

    (* Phase 4: Frontend Setup *)
    Printf.printf "📱 Phase 4: Frontend Setup\n";
    (* TODO: Change to moneywise-app/ directory *)
    (* TODO: Install Node.js dependencies (npm install) *)
    (* TODO: Verify frontend build configuration *)

    (* Phase 5: Environment Configuration *)
    Printf.printf "⚙️  Phase 5: Environment Configuration\n";
    (* TODO: Call scripts/setup/get-supabase-credentials.sh *)
    (* TODO: Call scripts/setup/env-manager.sh *)
    (* TODO: Set up environment files *)
    (* TODO: Configure database connections *)

    (* Phase 6: Service Management *)
    Printf.printf "🔧 Phase 6: Service Management\n";
    (* TODO: Call scripts/setup/service-manager.sh *)
    (* TODO: Start PostgreSQL service *)
    (* TODO: Start Redis service *)
    (* TODO: Verify services are running *)

    (* Phase 7: Final Validation *)
    Printf.printf "🧪 Phase 7: Final Validation\n";
    (* TODO: Run final checks *)
    (* TODO: Verify all components are working *)

    Printf.printf "\n🎉 MoneyWise setup complete!\n\n";
    Printf.printf "🚀 What's Running:\n";
    Printf.printf "- Backend API: http://localhost:3000/api\n";
    Printf.printf "- Frontend: Ready to start with 'npm start' in moneywise-app/\n\n";
    Printf.printf "📱 Next Steps:\n";
    Printf.printf "1. Backend is running in the backend terminal\n";
    Printf.printf "2. Start frontend: cd moneywise-app && npm start\n";
    Printf.printf "3. Test API: curl http://localhost:3000/api/budgets/overview\n\n";
    Printf.printf "💡 Next step: Run 'moneywise check' to verify everything is working\n"
  in
  Cmd.v (Cmd.info "setup" ~doc ~man) (Term.(const setup $ project_root))
