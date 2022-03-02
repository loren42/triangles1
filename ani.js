// Global variables

var condition = -1;
var which_quarter = -1
var motion_toward_me = -1
var match_side = -1
var overall_flip = -1
var response = -1
var RT = -1;
var time_final_shown = -1;
var movieName = -1
var gender_val = $("#gender_selector").val();
var age_val = $("#age_selector").val();
var total_time_elapsed = -1;
var end_time = -1;
var switchedWindows = -1;
var dq2_text = "NULL";
var dq3_text = "NULL"
var dq4_text = "NULL"
var dq5_text = "NULL"
var dq6_text = "NULL"
var completion_code = 000;
var movieTimer = 0;

var movie1_play_time

var movie2_play_time

var final_movie_play_time

var bad_subject = 0;
var viewedExample1 = 0;
var viewedExample2 = 0;
var viewedExample1PreTest = 0;
var viewedExample2PreTest = 0;
var viewedFinal = 0;

var cgibin_dir; // will get prepended to Python script names; leave as empty string if no such dir
//  n.b., if it does exist, remember to end with trailing slash!
//cgibin_dir = "/cgi-bin/";    //for localhost testing
cgibin_dir = ""; //for Dreamhost server

var instructions_id = "#instructions";
var instructions_bg_id = "#instructions_bg";
var next_button_id = "#nextbutton";
var back_button_id = "#backbutton";
var demographics_div_id = "#demographics_survey_div";
var window_resized_error_id = "#winresized";
var debriefing_questionairre_div_id = "#debriefing_questionairre_div";
var mobile_browser_error_id = "#mobilebrowser";
var BrowserCheck_div_id = "#BrowserCheck_div";
document.body.style.background = 'hsl(0,0%,100%)';
var win_width, win_height;
var win_resize_trial_invalid = 0;
var win_center_x, win_center_y;
var cursor_showing = 1;
var this_rt;
var worker_id = "";
var worker_id_valid;
var worker_id_used_before = -1; //-2:error, -1:undefined, 0:unused, 1:used
var user_agent_string = navigator.userAgent;
var browser_check_div_id = "BrowserCheckDiv";

var example_count = 5;
var examples =  [
                  'cones_0_deg_1_-1_89_forward_padded.mp4',
                  'cones_0_deg_1_-1_89_reverse_padded.mp4',
                  'cones_0_deg_1_179_269_forward_padded.mp4',
                  'cones_0_deg_1_179_269_reverse_padded.mp4',
                  'cones_0_deg_1_269_359_forward_padded.mp4',
                  'cones_0_deg_1_269_359_reverse_padded.mp4',
                  'cones_0_deg_1_89_179_forward_padded.mp4',
                  'cones_0_deg_1_89_179_reverse_padded.mp4',
                  'cones_30_deg_1_-1_89_forward_padded.mp4',
                  'cones_30_deg_1_-1_89_reverse_padded.mp4',
                  'cones_30_deg_1_179_269_forward_padded.mp4',
                  'cones_30_deg_1_179_269_reverse_padded.mp4',
                  'cones_30_deg_1_269_359_forward_padded.mp4',
                  'cones_30_deg_1_269_359_reverse_padded.mp4',
                  'cones_30_deg_1_89_179_forward_padded.mp4',
                  'cones_30_deg_1_89_179_reverse_padded.mp4'
                ];
var dq2_text = '';
var dq3_text = '';
var dq4_text = '';
var dq5_text = '';
var dq6_text = '';
var dq7_text = '';

var trial_list = [], total_count = 0, trial_count = 0;
function makePermutation() {
    total_count = 0;
    for (var i = 0; i < example_count; i++) {
        for (var j = 0; j < example_count; j++) {
            if (i == j) continue;
            trial_list[total_count] = [i, j]
            total_count++;
        }
    }
}

var start_stamp = Date.now();

$(window).load(ani_onready);

function gradePQs() {

    var formIncomplete = 1;
    var videoOk = 0;

    var a1 = document.getElementsByName('pq1');
    for (i = 0; i < a1.length; i++) {
        if (a1[i].checked) {
            formIncomplete = 0;
            if (a1[i].value == 'CubeSmooth') {
                videoOk = 1;
            }
            break;
        }
    }

    if (formIncomplete > 0) {
        pop("popDiv1")
    } else if (formIncomplete == 0 && videoOk == 1) {
        $("#playButton").hide();
        $("#instructions1").hide();
        $(BrowserCheck_div_id).hide();
        document.body.style.background = 'White ';
        do_instructions1();
        show_cursor();
    } else {
        $("#playButton").hide();
        $("#instructions1").hide();
        $("#container1").hide();
        $(BrowserCheck_div_id).hide();
        document.body.style.background = 'White ';
        do_failedBrowserCheck();
    }
    makePermutation();
    trial_list = shuffle(trial_list)
}




function ani_onready() {

    $("#example_container").hide()
    $("#final").hide()
    $("#instructions1").show();

    //some initial task setup code here

    win_width = $(window).width();
    win_height = $(window).height();
    win_center_x = win_width / 2;
    win_center_y = win_height / 2;

    //hide demographic survey

    $(demographics_div_id).hide();
    $("#demographics_race_popup").hide();
    $("#demographics_ethnicity_popup").hide();
    $("#demographics_sex_popup").hide();
    $("#demographics_age_popup").hide();

    //center instructions
    set_object_center(instructions_bg_id, 0, 0);
    set_object_center(instructions_id, 0, 0);

    //center window resized error message and hide it
    set_object_center(window_resized_error_id, 0, 0);
    $(window_resized_error_id).hide();

    //get worker ID if embedded in URL
    worker_id = getParamFromURL("workerId");
    worker_id_valid = validate_worker_id(worker_id);

    if (worker_id_valid) {
        determine_condition(worker_id);
        check_worker_id_used_before(worker_id);
    }

    //check that user is not on a mobile device, and if they're not, begin instructions
    if (validate_browser(user_agent_string)) {
        $(mobile_browser_error_id).hide();
        $(back_button_id).hide();
        $(next_button_id).hide();
        $(instructions_id).hide();
        $(instructions_bg_id).hide();
    } else {
        $(back_button_id).hide();
        $(next_button_id).hide();
        $(instructions_id).hide();
        $(instructions_bg_id).hide();
        set_object_center(mobile_browser_error_id, 0, 0);
    }
}

function do_instructions1() {

    $("#instructions1").hide();
    $("#video_container").hide()

    $(back_button_id).show();
    $(next_button_id).show();
    $(instructions_id).show();
    //$(instructions_bg_id).show();
    $(instructions_id).html("<b>Informed Consent Form</b><br><br>" +
        "<b>Purpose:</b> We are conducting research on visual perception.<br><br>" +
        "<b>Procedures:</b> This experiment takes about 3 minutes, and it is divided into two parts.  In Part One you will make simple judgments about short animations. In Part Two you will answer some questions about the experiment. We will give you specific instructions about how to complete these tasks before they begin.  You will receive $0.20 upon completing the experiment.<br><br>" +
        "(Click the NEXT button to continue.)");

    set_object_center(instructions_bg_id, 0, 0);
    set_object_center(instructions_id, 0, 0);
    set_object_center(next_button_id, 0, 275);
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(back_button_id).css('cursor', 'pointer');
    $(next_button_id).css('cursor', 'pointer');
    $(back_button_id).hide();
    $(next_button_id).click(do_instructions2);
}

function do_instructions2() {
    $(instructions_id).html("<b>Informed Consent Form</b><br><br>" +
        "<b>Risks and Benefits:</b> Completing these tasks poses no more risk of harm to you than do the experiences of everyday life (e.g., from working on a computer). Although this study will not benefit you personally, it will contribute to the advancement of our understanding of perception.<br><br>" +
        "<b>Confidentiality:</b> All of the responses you provide during this study will be anonymous. You will not be asked to provide any identifying information, such as your name, in any of the questionnaires. Typically, only the researchers involved in this study and those responsible for research oversight will have access to the information you provide. However, we may also share the data with other researchers so that they can check the accuracy of our conclusions; this will not impact you because the data are anonymous.<br><br>" +
        "(Click the NEXT button to continue.)");

    set_object_center(instructions_id, 0, 0);
    set_object_center(next_button_id, 100, 275);
    set_object_center(back_button_id, -100, 275);
    $(back_button_id).show();
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).click(do_instructions3);
    $(back_button_id).click(do_instructions1);
}

function do_instructions3() {
    $(instructions_id).html("<b>Informed Consent Form</b><br><br>" +
        "<b>Questions:</b> If you have any questions about this study, you may contact us.<br><br>" +
        "If you would like to talk with someone other than the researchers to discuss problems or concerns, to discuss situations in the event that a member of the research team is not available, or to discuss your rights as a research participant, you may contact:<br><br>" +
        "<br>" +
        "" +
        "" +
        "" +
        "(Click the NEXT button to continue.)");

    $(next_button_id).text("NEXT");
    set_object_center(instructions_id, 0, 0);
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).click(do_instructions4);
    $(back_button_id).click(do_instructions2);
}

function do_instructions4() {
    $(demographics_div_id).hide(); //in case they hit "back" from the demographics form
    $(instructions_id).html("<b>Informed Consent Form</b><br><br>" +
        "<b>Agreement to participate:</b> By clicking the \"Consent/Next\" button below, you acknowledge that you have read the above information, and agree to participate in the study.<br><br>" +
        "You must be at least 18 years of age to participate; agreeing to participate confirms you are 18 years of age or older.<br><br>" +
        "(Click the CONSENT/NEXT button to confirm your agreement and continue.)");

    $(next_button_id).text("CONSENT/NEXT");
    set_object_center(instructions_id, 0, 0);

    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).click(do_instructions5);
    $(back_button_id).click(do_instructions3);
}

function do_instructions5()
// do demographics questionnaire here, also get MTurk ID if we couldn't get it from the URL
{
    if (worker_id_used_before == 1) //they've done this before; crash out
        do_worker_id_used_error();
    else if (worker_id_used_before == 0) //they are clear to go; skip worker ID manual entry
        do_instructions5b();
    else //couldn't get worker ID from URL (either not specified, or there was an error; either way, go to manual entry)
        do_instructions5a();
}

function do_instructions5a() // manual entry of MTurk worker ID
{
    $(instructions_id).html("<b>M-Turk Worker ID Entry</b><br><br>" +
        "It looks like we were unable to automatically determine your Amazon M-Turk worker ID. Please enter it in the box below.<br><br>" +
        "Your M-Turk worker ID should be a 12-to-15 character series of random letters and numbers, starting with A (for example, A1BGDXZ95IQ3W).<br><br>" +
        '<input type="text" id="mturk_worker_id_input"><br><br>' +
        "(Click the NEXT button to continue.)");

    $(next_button_id).text("NEXT");
    set_object_center(instructions_id, 0, 0);
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).click(do_instructions5a_validate_input);
    $(back_button_id).click(do_instructions4);
}

function do_instructions5a_validate_input() // valid worker ID entered?
{
    var user_input_worker_id = $("#mturk_worker_id_input").val();
    if (validate_worker_id(user_input_worker_id)) {
        determine_condition(user_input_worker_id);
        check_worker_id_used_before(user_input_worker_id);
        worker_id = user_input_worker_id;
        do_instructions5b();
    } else {
        pop("popDiv2")
    }
}

function do_instructions5b() {
    $(instructions_id).html("");
    $(demographics_div_id).show();
    attach_popup("#race_selector", "#demographics_race_popup");
    attach_popup("#ethnicity_selector", "#demographics_ethnicity_popup");
    attach_popup("#gender_selector", "#demographics_sex_popup");
    attach_popup("#age_selector", "#demographics_age_popup");

    $(next_button_id).text("NEXT");
    set_object_center(instructions_id, 0, 0);
    set_object_center(demographics_div_id, 0, 0);
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).click(validate_demographics);
    $(back_button_id).click(do_instructions4);
}

function attach_popup(item_id, popup_id) {
    $(item_id).mouseenter({ popup_id: popup_id }, activate_popup);
    $(item_id).mouseout({ popup_id: popup_id }, deactivate_popup);
}

function activate_popup(e) {
    $(e.data.popup_id).show();
    set_object_center(e.data.popup_id, 300, e.pageY - win_center_y);
}

function deactivate_popup(e) {
    $(e.data.popup_id).hide();
}

function do_worker_id_used_error() {
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).hide();
    $(back_button_id).hide();
    $(instructions_id).html("<b>You have already completed this HIT!</b><br><br>" +
        "Sorry, it looks like your worker ID has already been used to complete this HIT. Thus, you are ineligible to do the same experiment again.<br><br>" +
        "If you believe you have reached this message in error, please email the experimenter.<br><br>" +
        "Otherwise, please return the HIT.");
    set_object_center(instructions_id, 0, 0);
}

function validate_demographics() {
    //going to just hard-code object IDs here, so sue me...
    race_val = $("#race_selector").val();
    ethnicity_val = $("#ethnicity_selector").val();
    gender_val = $("#gender_selector").val();
    age_val = $("#age_selector").val();

    if (race_val == "RaceEmpty" || ethnicity_val == "EthnicityEmpty" || gender_val == "SexEmpty" || age_val == "AgeEmpty") {
        pop("popDiv1")
        // alert('None of the values in the demographics form should be left empty! Please try again. If you prefer not to provide your race, ethnicity, or gender, please select "Prefer not to answer." If you believe you have reached this message in error, please email the experimenter.');
    } else {
        // $.post( cgibin_dir + "ani_log_demographics.py", { workerid: worker_id,
        //                                                     race: race_val, ethnicity: ethnicity_val,
        //                                                     gender: gener_val, age: age_val, uas: user_agent_string } );
        do_instructions6();
    }
}

function do_instructions6() {
    $(demographics_div_id).hide();
    if (worker_id_used_before == 1) //they've done this before; crash out
        do_worker_id_used_error();
    else if (worker_id_used_before == 0) //they are clear to go
        do_instructions6a();
    else //there was some kind of error; go to error screen
        do_worker_id_logging_error();
}

function do_worker_id_logging_error() {
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).hide();
    $(back_button_id).hide();
    $(instructions_id).html("<b>Error processing worker ID!</b><br><br>" +
        "Sorry, it looks like our system encountered a problem while trying to log your M-Turk worker ID. In theory this should never happen, but web servers can be unpredictable somef.<br><br>" +
        "Please close this window/tab and try reloading the HIT from the original link. If the problem occurs a second time, please email the experimenter.");
    set_object_center(instructions_id, 0, 0);
}


function do_instructions6a() {
    $(instructions_id).html("<b>Instructions</b><br><br>" +
        "Adjust your chair so that you are sitting at arm's length from the monitor, and maximize your browser window so that it fills your entire screen.");

    set_object_center(instructions_id, 0, 0);
    // set_object_center( next_button_id, 100, 275 );
    // set_object_center( back_button_id, -100, 275 );
    $(next_button_id).off("click");
    $(back_button_id).off("click");
    $(next_button_id).click(do_instructions8);
    $(back_button_id).click(do_instructions5);
}


function do_instructions8() {
    win_width = $(window).width();
    win_height = $(window).height();
    win_center_x = win_width / 2;
    win_center_y = win_height / 2;

    $(next_button_id).off("click");
    $(back_button_id).off("click");
    if (win_width < $(instructions_bg_id).width() || win_height < $(instructions_bg_id).height()) //window too small
    {
        $(instructions_id).html("<b>Window too small!</b><br><br>" +
            "Sorry, it looks like your browser window is too small to adequately display the experimental task. Please try again on a larger display.<br><br>" +
            "If you are unable to perform the task on a larger display, please return the HIT.<br><br>" +
            "If you believe you have reached this message in error, please email the experimenter.");
        $(next_button_id).hide();
        $(back_button_id).hide();
        set_object_center(instructions_id, 0, 0);
    } else //window size OK; proceed
    {
        $(instructions_id).html("<b>Window size check: OK</b><br><br>" +
            "Excellent! It looks like your browser window is large enough to display the experimental task.  Please do not resize your browser window.  <br><br> <b>IF YOU RESIZE YOUR BROWSER WINDOW, THE EXPERIMENTAL TASK WILL BE INTERRUPTED AND YOU WILL NOT BE ABLE TO COMPLETE THE HIT! </b>");
        $(window).resize(window_was_resized);
        set_object_center(instructions_bg_id, 0, 0);
        set_object_center(instructions_id, 0, 0);
        $(next_button_id).click(do_instructions9);
        $(back_button_id).click(do_instructions6a);
    }
}


function do_instructions9() {
    $(instructions_id).html("<b>Instructions</b><br><br>" +
        "The experiment takes about 1 minute to complete. " +
        "Please stay focused throughout, since your data will be useful to us only if you remain engaged.")

    set_object_center(instructions_id, 0, 0);

    trial_count = 0;
    document.querySelector('#example1').src = 'mp4/' + examples[trial_list[trial_count][0]];
    document.querySelector('#example2').src = 'mp4/' + examples[trial_list[trial_count][1]];
    document.querySelector('#final_video').src = 'mp4/cones_30_deg_0_-1_89_reverse_padded.mp4';
    movieName = 'cones_30_deg_0_-1_89_reverse_padded.mp4';
    which_quarter = 0;
    motion_toward_me = 1;
    match_side = 0;
    overall_flip = 0;

    document.querySelector("#final_video").load()
    document.querySelector("#example1").load()
    document.querySelector("#example2").load()

    $(next_button_id).off("click");
    $(next_button_id).click(do_task);
    $(back_button_id).click(do_instructions8);

    testViewed();
}


function do_task() {
    set_object_center(next_button_id, 0, 240);
    $(next_button_id).off("click");
    $(next_button_id).click(showFinal);
    $(next_button_id).hide();
    $(back_button_id).hide();
    $(instructions_id).hide();
    $(instructions_bg_id).hide();

    $("#instructions1").html("<b>Task</b><br><br>" +
        "Please play both example videos below as many times as you need, until you feel familiar with them.  After you've viewed both examples at least once, press 'Next' to view a final test video.  You will then say whether the test video looked more like Example 1 or like Example 2.</b>");
    $("#instructions1").show();

    $("#example_container").show();
    $("#example1ResponseButton").hide();
    $("#example2ResponseButton").hide();
}


function showFinal() {
    $(next_button_id).off("click");
    $(next_button_id).click(testViewed);
    $(next_button_id).hide();

    time_final_shown = Date.now();
    viewedExample1PreTest = viewedExample1;
    viewedExample2PreTest = viewedExample2;
    $("#example_container").hide()
    $("#instructions1").html("<b>Task</b><br><br>You will have only one chance to view the test animation.  Press play when you are ready.</b>");
    $("#final").show();
}


function showNextButton() {

    $(next_button_id).show();
}


function showNextButtonAgain() {

    $(next_button_id).show();
}


function testViewed() {

    $(next_button_id).hide();
    $(back_button_id).hide();
    set_object_center(next_button_id, 0, 240);
    $("#final").hide();

    openNav();
    $('#myNav').click(function() {
        closeNav();
        $("#example_container").show();
        html = "<b>" + (trial_count + 1) + "/" + total_count + "</b><br><br>" +
            "Which do you prefer?  If you're not sure, please just give your best guess.</b>"
        $("#instructions1").html(html);
        $("#instructions1").show();
        $("#instructions").hide();
        $("#example1ResponseButton").hide();
        $("#example2ResponseButton").hide();
    });
}

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

function submitChoice1() {
    response = 0;
    RT = Date.now() - time_final_shown;
    $("#instructions1").hide();
    $("#example_container").hide()
    if (trial_count == total_count) {
        $(debriefing_questionairre_div_id).show();
    }
    else {
        last_step(start_stamp);
    }
}

function submitChoice2() {
    response = 1;
    RT = Date.now() - time_final_shown;
    $("#instructions1").hide();
    $("#example_container").hide()
    if (trial_count == total_count) {
        $(debriefing_questionairre_div_id).show();
    }
    else {
        last_step(start_stamp);
    }
}


function gradeDebriefingQuestions() {
    var i;
    var formIncomplete = 1;

    var a1 = document.getElementsByName('dq1');
    formIncomplete = 1;
    for (i = 0; i < a1.length; i++) {
        if (a1[i].checked) {
            formIncomplete = 0;
            if (a1[i].value == "Yes") {
                switchedWindows = 1;
            } else if (a1[i].value == "No") {
                switchedWindows = 0;
            }
            break;
        }
    }

    dq2_text = document.getElementById('dq2').value
    dq3_text = document.getElementById('dq3').value
    dq4_text = document.getElementById('dq4').value
    dq5_text = document.getElementById('dq5').value
    dq6_text = document.getElementById('dq6').value
    dq7_text = document.getElementById('dq7').value

    if (dq2_text == "" || dq3_text == "" || dq4_text == "" || dq5_text == "" || dq6_text == "" || dq7_text == "") {
        formIncomplete = 1;
    }

    if (formIncomplete > 0) {
        pop("popDiv1")

    } else {

        completion_code = generate_completion_code();

        // last_step(start_stamp);
        total_time_elapsed = Date.now() - start_stamp;

        $.post(cgibin_dir + "ani_log_trial_video.py", { 
            workerid: worker_id, 
            gender: gender_val, 
            age: age_val, 
            win_resized: win_resize_trial_invalid, 
            total_time: total_time_elapsed, 
            condition, which_quarter, motion_toward_me, match_side, overall_flip, response, RT, movieName, 
            admitted_switching_windows: switchedWindows, 
            summarize_instructions: dq2_text, 
            clear_enough: dq3_text, 
            heard_of: dq4_text, 
            display_problems: dq5_text, 
            how_well: dq6_text, 
            decision_criterion: dq7_text, 
            comp_code: completion_code, 
            left: '',
            right: ''
        });
        do_debrief();
    }
}

function last_step(start_stamp) {
    $(debriefing_questionairre_div_id).hide();
    show_cursor();
    total_time_elapsed = Date.now() - start_stamp;

    $.post(cgibin_dir + "ani_log_trial_video.py", { 
        workerid: worker_id, 
        gender: gender_val, 
        age: age_val, 
        win_resized: win_resize_trial_invalid, 
        total_time: total_time_elapsed, condition, which_quarter, motion_toward_me, match_side, overall_flip, response, RT, movieName, 
        admitted_switching_windows: switchedWindows, 
        summarize_instructions: dq2_text, 
        clear_enough: dq3_text, 
        heard_of: dq4_text, 
        display_problems: dq5_text, 
        how_well: dq6_text, 
        decision_criterion: dq7_text, 
        comp_code: completion_code,
        left: examples[trial_list[trial_count][0]],
        right: examples[trial_list[trial_count][1]]
     });

    $(instructions_id).show();
    

    $(instructions_id).html('<span style="text-align: center; display: table; font-weight: bold; margin: 0 auto; font-size: 20px; color: black">You\'re all done! Completion code:</span><br><br>' +
        '<span style="text-align: center; display: table; font-weight: bold; margin: 0 auto; font-size: 24px; color: black">' + completion_code + "</span><br><br>" +
        "Make sure to write down/copy your completion code now, and then click the NEXT button for an explanation of the experiment.");

    $(next_button_id).show();

    trial_count++;

    time_final_shown = Date.now();
    viewedExample1 = 0;
    viewedExample2 = 0;
    viewedExample1PreTest = viewedExample1;
    viewedExample2PreTest = viewedExample2;
    viewedFinal=1;
    $('#example1ResponseButton').hide();
    $('#example2ResponseButton').hide();
    $('#instructions').hide();
    $('#instructions_bg').hide();
    
    if (trial_count == total_count) {
        $(debriefing_questionairre_div_id).show();
        return;
    }
    $('#instructions1').show();
    document.querySelector('#example1').src = 'mp4/' + examples[trial_list[trial_count][0]];
    document.querySelector('#example2').src = 'mp4/' + examples[trial_list[trial_count][1]];
    document.querySelector("#example1").load()
    document.querySelector("#example2").load()
    testViewed();

    set_object_center(instructions_bg_id, 0, 0);
    set_object_center(instructions_id, 0, 0);
    set_object_center(next_button_id, 0, 275);
}

function do_debrief() {

    $("#instructions1").hide();
    $("#example_container").hide()
    $(debriefing_questionairre_div_id).hide();

    $(instructions_id).html("<b>Debriefing</b><br><br>" +
        "Thank you for participating! We are interested in the perception of living things. An important characteristic of all animals is that they have fronts.  In this experiment we asked you to judge whether an ambiguous silhouette better resembled a cone facing toward you, or a cone facing away from you." +
        "<br><br>Given the importance of detecting animals facing toward us, we suspect that participants will be biased to see the silhouette as facing toward them." +
        "<br><br><b>Please do not tell other M-Turkers about the nature/hypotheses of this study</b> -- we don't want prior knowledge to affect how people approach the task. If you have questions about the study or had any technical difficulties, please contact the experimenter. Now please return to MTURK to enter your completion code: " + completion_code);

    $(instructions_id).show();
    set_object_center(instructions_id, 0, 0);
    $(next_button_id).off("click");
    $(next_button_id).hide();
}

function generate_completion_code() {
    var n_characters = 20;
    var code_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var comp_code = "";
    var char_ind;

    for (var i = 0; i < n_characters; i++) {
        char_ind = Math.floor(Math.random() * code_alphabet.length);
        comp_code = comp_code + code_alphabet.charAt(char_ind);
    }
    return comp_code;
}



function end_break() {
    $(document).off("click");
    $(break_text_id).hide();
    $(break_text_2_id).hide();
    hide_cursor();
    setTimeout(do_trials1, iti);
}

function window_was_resized() {
    win_resize_trial_invalid = 1;
}

function set_object_center(obj_id, x_coord, y_coord) {
    var obj_width, obj_height;
    var top_coord, left_coord;
    obj_width = $(obj_id).outerWidth();
    obj_height = $(obj_id).outerHeight();
    top_coord = y_coord - (obj_height / 2) + win_center_y;
    left_coord = x_coord - (obj_width / 2) + win_center_x;
    $(obj_id).offset({ top: top_coord, left: left_coord });
}

function hide_cursor() {
    if (!cursor_showing)
        return;

    $('html').css({ cursor: 'none' });
    cursor_showing = 0;
}

function show_cursor() {
    if (cursor_showing)
        return;

    $('html').css({ cursor: 'default' });
    cursor_showing = 1;
}

function validate_browser(uas) {
    var regex1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
    var regex2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
    var r2_substr_length = 4;
    var uas_sub = uas.substr(0, r2_substr_length);

    if (regex1.test(uas))
        return 0;

    if (regex2.test(uas_sub))
        return 0;

    return 1;
}

function validate_worker_id(id_str) {
    var min_length = 10;
    var max_length = 25;
    var bad_reg_ex = /\W/;

    if (id_str.length < min_length)
        return 0;

    if (id_str.length > max_length)
        return 0;

    if (id_str.charAt(0) != 'A' && id_str.charAt(0) != 'a')
        return 0;

    if (bad_reg_ex.test(id_str))
        return 0;

    return 1;
}

function check_worker_id_used_before(id_str) {
    $.post(cgibin_dir + "ani_check_workerid.py", { workerid: id_str }, check_worker_id_callback);
}

function check_worker_id_callback(check_status) {
    if (check_status == "used")
        worker_id_used_before = 1;
    else if (check_status == "unused")
        worker_id_used_before = 0;
    else if (check_status == "error")
        worker_id_used_before = -2;
    else
        worker_id_used_before = -1;
}

// BELOW COURTESY OF GARY LUPYAN -- COPIED FROM
//  http://sapir.psych.wisc.edu/wiki/index.php/MTurk
function getParamFromURL(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}



function rotateAnnotationCropper(offsetSelector, xCoordinate, yCoordinate, cropper, face_trial) {
    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width() / 2;
    var y = -1 * (yCoordinate - offsetSelector.offset().top - offsetSelector.height() / 2);
    var theta = Math.atan2(y, x) * (180 / Math.PI);

    var cssDegs = convertThetaToCssDegs(theta);

    var rotate = 'rotate(' + cssDegs + 'deg)';
    cropper.css({ '-moz-transform': rotate, 'transform': rotate, '-webkit-transform': rotate, '-ms-transform': rotate });
    $('body').on('mouseup', function(event) { $('body').unbind('mousemove') });

    output = cssDegs + randomOffset;
    output = (output % 360) + 1;
    if (output < 0) {
        output = 360 + output; // since angles go from 0 to 270 and then -90 back to 0
    }
    faceNum = Math.round(output / degreesPerFace);
    if (faceNum < 1) {
        faceNum = 1;
    }
    // alert(thisMorph)
    // alert(images[faceNum-1].src)
    // alert(all_face_image_sets[thisMorph]);


    $("#face").attr('src', all_face_image_sets[face_order[face_trial]][faceNum - 1].src);


    // element.src = ;
    return [faceNum, cssDegs, output, xCoordinate, yCoordinate];

}

function convertThetaToCssDegs(theta) {
    var cssDegs = 90 - theta;
    return cssDegs;
}



function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}




//randomX = Math.round(Math.random()*);
function rotateAnnotationCropper_circleExpansion(offsetSelector, xCoordinate, yCoordinate, cropper, expansion) {
    //alert(offsetSelector.left);
    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width() / 2;
    var y = -1 * (yCoordinate - offsetSelector.offset().top - offsetSelector.height() / 2);
    var theta = Math.atan2(y, x) * (180 / Math.PI);


    var cssDegs = convertThetaToCssDegs(theta);
    var rotate = 'rotate(' + cssDegs + 'deg)';
    cropper.css({ '-moz-transform': rotate, 'transform': rotate, '-webkit-transform': rotate, '-ms-transform': rotate });
    $('body').on('mouseup', function(event) { $('body').unbind('mousemove') });
    //return cssDegs;
    output = cssDegs;
    output = (output % 360) + 1;
    if (output < 0) {
        output = 360 + output; // since angles go from 0 to 270 and then -90 back to 0
    }
    expand = Math.round(output / degreesPerStep);
    if (expand < 1) {
        expand = 1;
    }

    if (expand > (numSteps / 2)) {
        expand = numSteps - (expand - 1);
    }

    expand = expand * expansion; // multiply the raw number by the number of pixels each degree step should add

    circleStats = expandCircle(testCircle, expand);

}

function convertThetaToCssDegs(theta) {
    var cssDegs = 90 - theta;
    return cssDegs;
}


//move and expand
function expandCircle(circleElement, expand) {

    var $this = $(circleElement),
        circle = $this.data(),
        hoveredX = circle.left + circle.radius,
        hoveredY = circle.top + circle.radius;

    // change css properties
    $this.css({
        "width": (2 * circle.radius) + expand + "px",
        "height": (2 * circle.radius) + expand + "px",
        "left": circle.left - (expand / 2) + "px",
        "top": circle.top - (expand / 2) + "px",
        "border-top-left-radius": circle.radius + (expand / 2) + "px",
        "border-top-right-radius": circle.radius + (expand / 2) + "px",
        "border-bottom-left-radius": circle.radius + (expand / 2) + "px",
        "border-bottom-right-radius": circle.radius + (expand / 2) + "px",

    });


    return [circle.left, circle.top, circle.width, circle.height];
};

function startTimer() {
    if (seconds < 0) {
        clearInterval(timer);
    } else {
        seconds--;
    }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function do_failedBrowserCheck() {
    $(instructions_id).html("<b>Invalid Browser!</b><br><br>" +
        "Your responses indicate that your browser will be unable to render the experiment properly.  You may return to MTurk now, or, if you like, you can try reloading this page from a different browser.")
    $(instructions_id).show();

    set_object_center(instructions_id, 0, 0);

}

function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += '[' + obj[p] + ']' + '\t';
        }
    }
    return str;
}


function determine_condition(id_str) {
    $.post(cgibin_dir + "determine_condition.py", { workerid: id_str }, determine_condition_callback);
}

function determine_condition_callback(check_status) {

    condition = +check_status;

    if (condition == -1) {
        alert('Abort: experiment sample reached!')
    }
    console.log(condition)


}

