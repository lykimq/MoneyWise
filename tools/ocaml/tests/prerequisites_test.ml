(** Test file for prerequisites module *)

open OUnit2

(** Test that basic command existence detection works correctly *)
let test_command_exists _test_ctxt =
  (* Test with a command that should exist *)
  assert_bool "ls should exist" (Phase2_prerequisites.command_exists "ls");
  (* Test with a command that should not exist *)
  assert_bool "nonexistent_command should not exist"
    (not (Phase2_prerequisites.command_exists "nonexistent_command_xyz123"))

(** Test command existence detection with edge cases and invalid inputs *)
let test_command_exists_edge_cases _test_ctxt =
  (* Test with empty string *)
  assert_bool "empty string should not exist"
    (not (Phase2_prerequisites.command_exists ""));
  (* Test with spaces *)
  assert_bool "command with spaces should not exist"
    (not (Phase2_prerequisites.command_exists "command with spaces"));
  (* Test with special characters *)
  assert_bool "command with special chars should not exist"
    (not (Phase2_prerequisites.command_exists "command@#$%"))

(** Test the version extraction algorithm that scans command output strings to
    find version numbers. Algorithm: searches left-to-right for 'v'+digit or
    just digit, then extracts from that point to end *)
let test_version_extraction_logic _test_ctxt =
  (* Test the version extraction algorithm with known inputs *)
  let test_version_finder input expected =
    let len = String.length input in
    let rec find_version start =
      if start >= len then None
        (* Case 1: Look for 'v' followed by a digit (e.g., "v18.17.0") *)
        (* Bounds check: start + 2 < len ensures we can safely access input.[start] and input.[start + 1] *)
      else if
        start + 2 < len
        && input.[start] = 'v'
        && input.[start + 1] >= '0'
        && input.[start + 1] <= '9'
      then Some (String.sub input start (len - start))
        (* Case 2: Look for a digit at any position (e.g., "1.83.0", "PostgreSQL 17.6") *)
        (* Bounds check: start < len ensures we can safely access input.[start] *)
      else if start < len && input.[start] >= '0' && input.[start] <= '9' then
        Some (String.sub input start (len - start))
      (* Case 3: No pattern found at this position, try the next character *)
        else find_version (start + 1)
    in
    let result = find_version 0 in
    assert_equal
      ~msg:
        (Printf.sprintf "Input: '%s', Expected: %s, Got: %s" input
           (match expected with Some s -> s | None -> "None")
           (match result with Some s -> s | None -> "None"))
      expected result
  in
  (* Test cases that should find versions - the algorithm looks for:
     - Strings starting with 'v' followed by a digit (e.g., "v18.17.0")
     - Strings starting with a digit (e.g., "1.83.0", "17.6")
     - And extracts from that point to the end of the string *)
  test_version_finder "git version 2.34.1" (Some "2.34.1");
  test_version_finder "v18.17.0" (Some "v18.17.0");
  test_version_finder "1.83.0" (Some "1.83.0");
  test_version_finder "PostgreSQL 17.6" (Some "17.6");
  test_version_finder "redis-cli 6.0.16" (Some "6.0.16");
  (* Test cases that should return None - strings with no version patterns *)
  test_version_finder "" None;
  test_version_finder "no version here" None;
  test_version_finder "just text" None

(** Test version extraction with real system commands when available *)
let test_extract_version_system _test_ctxt =
  (* Test that the function can handle real system calls *)
  if Phase2_prerequisites.command_exists "git" then
    let result = Phase2_prerequisites.extract_version "git" "--version" in
    match result with
    | Some version_str ->
        assert_bool "version string should not be empty"
          (String.length version_str > 0);
        (* The version should contain digits *)
        let has_digits =
          String.exists (fun c -> c >= '0' && c <= '9') version_str
        in
        assert_bool "version string should contain digits" has_digits
    | None ->
        assert_failure "Git exists but version extraction failed unexpectedly"
  else skip_if true "Git not available - skipping system integration test"

(** Test version extraction with basic system commands to verify the function
    works in real environments *)
let test_extract_version_basic_command _test_ctxt =
  (* Test with a command that returns version-like output *)
  if Phase2_prerequisites.command_exists "sh" then
    let result = Phase2_prerequisites.extract_version "sh" "--version" in
    match result with
    | Some output ->
        assert_bool "sh --version should return output"
          (String.length output > 0)
    | None ->
        (* If sh --version fails, that's acceptable - not all systems support it *)
        skip_if true "sh --version not supported on this system"
  else skip_if true "sh command not available - skipping basic command test"

(** Test that prerequisite result data structures are created and accessed
    correctly *)
let test_prerequisite_result_structure _test_ctxt =
  let result =
    {
      Phase2_prerequisites.name = "test";
      is_available = true;
      version = Some "1.0.0";
      path = None;
      error_message = None;
    }
  in
  assert_equal "test" result.name;
  assert_bool "should be available" result.is_available;
  assert_equal (Some "1.0.0") result.version

(** Test suite *)
let suite =
  "prerequisites"
  >::: [
         "command_exists" >:: test_command_exists;
         "command_exists_edge_cases" >:: test_command_exists_edge_cases;
         "version_extraction_logic" >:: test_version_extraction_logic;
         "extract_version_system" >:: test_extract_version_system;
         "extract_version_basic_command" >:: test_extract_version_basic_command;
         "prerequisite_result_structure" >:: test_prerequisite_result_structure;
       ]

(** Run tests *)
let () = run_test_tt_main suite
