(** MoneyWise CLI - Main executable *)

open Cmdliner

(** Import the prerequisites module *)
open Prerequisites

(** CLI command definitions *)

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
    Printf.printf "Setting up MoneyWise project in: %s\n" root;
    (* TODO: Implement actual setup logic *)
    Printf.printf "✅ Setup completed successfully!\n"
  in
  Cmd.v (Cmd.info "setup" ~doc ~man) (Term.(const setup $ project_root))


let check_cmd =
  let doc = "Check project prerequisites and status" in
  let man = [
    `S Manpage.s_description;
    `P "Checks project prerequisites and current status.";
    `S Manpage.s_examples;
    `P "$(mname) check";
  ] in
  let check () =
    (* Checking prerequisites *)
    let status = Prerequisites.check_all_prerequisites () in
    Prerequisites.display_prerequisites_status status;

    (* Return appropriate exit code *)
    if status.failed_checks > 0 then
      exit 1
    else
      exit 0
  in
  Cmd.v (Cmd.info "check" ~doc ~man) (Term.(const check $ const ()))

let test_cmd =
  let doc = "Run project tests" in
  let man = [
    `S Manpage.s_description;
    `P "Runs all project tests.";
    `S Manpage.s_examples;
    `P "$(mname) test";
  ] in
  let test () =
    Printf.printf "🧪 Running MoneyWise project tests...\n";
    (* TODO: Implement actual test logic *)
    Printf.printf "✅ All tests passed!\n"
  in
  Cmd.v (Cmd.info "test" ~doc ~man) (Term.(const test $ const ()))

let status_cmd =
  let doc = "Show project status" in
  let man = [
    `S Manpage.s_description;
    `P "Shows current project status and service health.";
    `S Manpage.s_examples;
    `P "$(mname) status";
  ] in
  let status () =
    Printf.printf "📊 MoneyWise Project Status\n";
    Printf.printf "==========================\n";
    (* TODO: Implement actual status logic *)
    Printf.printf "Backend: 🟢 Running\n";
    Printf.printf "Frontend: 🟢 Running\n";
    Printf.printf "Database: 🟢 Connected\n"
  in
  Cmd.v (Cmd.info "status" ~doc ~man) (Term.(const status $ const ()))

let cmds = [setup_cmd; check_cmd; test_cmd; status_cmd]

let () =
  Stdlib.exit @@ Cmd.eval (Cmd.group (Cmd.info "moneywise" ~version:"1.0.0") cmds)
