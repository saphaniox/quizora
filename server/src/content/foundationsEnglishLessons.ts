export interface FoundationsEnglishSource {
  title: string;
  url: string;
}

export interface FoundationsEnglishLesson {
  title: string;
  summary: string;
  objectives: string[];
  body: string;
  estimatedMinutes: number;
  sources: FoundationsEnglishSource[];
}

export type FoundationsEnglishSectionId =
  | "foundations-english"
  | "foundations-reading"
  | "foundations-spelling";

export const foundationEnglishLessons: Record<
  FoundationsEnglishSectionId,
  FoundationsEnglishLesson
> = {
  "foundations-english": {
    title: "English Language: Build Clear, Complete Sentences",
    summary:
      "A practical sequence for shaping complete sentences, choosing precise words, controlling verbs and agreement, and combining ideas without losing meaning.",
    objectives: [
      "Identify the subject, predicate, and complete thought in a sentence, and repair fragments and run-ons.",
      "Choose concrete, precise words and use context to select an appropriate meaning and register.",
      "Maintain subject–verb agreement and consistent verb tense while revising for clarity.",
      "Combine related ideas with coordination, subordination, and punctuation that makes their relationship clear.",
      "Apply a repeatable editing sequence to a paragraph and explain the revisions made.",
    ],
    body: `## Chapter 1 — Start with a complete thought

English sentences do more than place words beside one another: they make a relationship clear. A simple independent clause contains a subject (who or what the sentence is about) and a predicate (what the subject does, is, or experiences), and it can stand as a complete thought. In “The lantern flickered,” *lantern* is the subject and *flickered* is the predicate. In “The old lantern near the steps flickered in the wind,” the subject is longer, but the core relationship remains the same.

Find the core before judging sentence length. Ask “Who or what?” and then “did, is, or experienced what?” In “After the rain stopped, the team returned to practice,” the team returned is the independent clause. “After the rain stopped” gives a time relationship but cannot stand alone: it leaves a reader asking what happened after the rain stopped. Such a dependent clause is useful when attached to a complete clause; alone, it is a fragment.

Fragments are not always short. “Because the map had been copied incorrectly and the labels were difficult to read.” contains a subject and verb, but *because* makes the clause dependent. Repair it by attaching it to a complete thought: “Because the map had been copied incorrectly and the labels were difficult to read, we checked the route against the original.” Or remove the subordinating word if the reason is not needed: “The map had been copied incorrectly, and the labels were difficult to read.” Do not add words blindly; decide what the reader needs.

A run-on joins independent clauses without appropriate punctuation or a joining word. “The bell rang we packed our books” contains two complete thoughts. One repair is a period: “The bell rang. We packed our books.” Another is a comma plus a coordinating conjunction: “The bell rang, so we packed our books.” A semicolon can join closely related independent clauses: “The bell rang; we packed our books.” A comma by itself is not enough to join two complete clauses. That error is called a comma splice: “The bell rang, we packed our books.”

**Worked revision.** Original: “When the bus arrived. We lined up quickly, the driver opened the door.” First, identify the dependent opener: “When the bus arrived” cannot stand alone, so attach it to “we lined up quickly.” Then inspect the remaining clause boundary: “the driver opened the door” is another complete thought, so use a period, a conjunction, or a semicolon. One clear revision is: “When the bus arrived, we lined up quickly. The driver opened the door.” The comma after the opening dependent clause helps readers see where the main thought begins.

### Practice 1

For each item, name the problem and revise it. More than one revision can be correct.

1. “While the class waited in the hallway.”
2. “The garden was dry, the volunteers carried water.”
3. “I checked the instructions I started the experiment.”
4. “The shop was closed. Because it was a holiday.”

Keep the meaning of the original when you revise. A correct sentence that changes the intended cause, time, or emphasis is not a successful edit.

## Chapter 2 — Choose words that carry the right meaning

Precise language helps readers picture the action and understand the writer’s point. General verbs such as *went*, *got*, and *did* are sometimes exactly right, but they can hide useful information. Compare “Mina went across the room” with “Mina hurried across the room” or “Mina wandered across the room.” The more specific verbs suggest different movement and purpose. Choose a precise word only when the context supports it; “hurried” would be inaccurate if Mina moved slowly.

Use context to check a word’s meaning. Read the whole sentence, notice nearby clues, and ask whether the word fits the situation. In “The coach praised Leo’s steady effort,” *steady* means consistent, not physically balanced. If a word has several meanings, a dictionary can confirm which sense fits. Do not assume that two similar-looking words are interchangeable. *Advice* is a noun (“Her advice helped”), while *advise* is a verb (“I advise checking the source”). Reading a sentence aloud can expose an awkward choice, but sound alone cannot prove that a word is correct.

Register is the level of formality suited to a reader and purpose. A message to a friend might say “Can you send me the notes?” A formal request might say “Could you please share the notes from yesterday’s lesson?” Neither is automatically better; the audience determines the best fit. Avoid inflated language that makes a simple point harder to understand. “We used a ruler to measure the table” is usually clearer than “A measuring instrument was utilized to ascertain the table’s dimensions.”

Pronouns replace nouns, but readers need to know what each pronoun refers to. “When Ava spoke to Priya, she smiled” is ambiguous: the reader cannot tell who smiled. Repeat a name or reorganize: “Ava smiled when she spoke to Priya.” Also watch broad words such as *this*, *that*, and *it*. In “The group changed its plan after a long discussion, and this surprised the teacher,” *this* could refer to the discussion or the change. Replace it with the intended idea: “The group’s decision to change its plan surprised the teacher.”

### Practice 2

1. Replace the vague verb in “The bird went over the fence” with two different verbs that suggest different actions.
2. Select *advice* or *advise*: “I will ___ you to read the directions first.”
3. Clarify the pronoun: “Nora thanked Mei after she found the missing notebook.”
4. Rewrite this sentence for a formal email without making it sound needlessly grand: “Hey, send me the schedule.”

For items 1 and 3, several answers are possible. State how your version changes or preserves the original meaning.

## Chapter 3 — Keep verbs and subjects in agreement

The verb form should agree with its subject. Singular third-person subjects in the present tense usually take an *-s* ending: “The bell rings”; plural subjects use the base form: “The bells ring.” A common mistake is to make the verb agree with a nearby noun instead of the true subject. In “The basket of apples is on the counter,” the subject is *basket*, not *apples*. The phrase *of apples* describes the basket and does not control the verb.

Find the subject by temporarily setting aside descriptive phrases. “The list of materials for the projects is on the board” becomes “The list is on the board.” The subject *list* is singular, so use *is*. In “The materials for the project are on the board,” the subject is *materials*, so use *are*. Words such as *each*, *everyone*, and *someone* are grammatically singular in standard edited English: “Everyone has a copy.” Meaning can feel plural because a group is involved, but the verb still matches the grammatical subject.

With *either/or* and *neither/nor*, locate the subjects and read the construction carefully; forms can depend on the nouns and on the style guide being followed. A clear revision often avoids a clumsy mismatch: instead of “Neither the captain nor the players is ready,” write “Neither the players nor the captain is ready” only if the intended nearby subject is singular, or recast as “The captain and players are not ready.” Recasting is often the clearest option when the original construction sounds awkward.

Verb tense shows when an action happens. In a narrative, choose the time frame and keep it unless the time genuinely changes. “Yesterday we entered the library, found a quiet table, and began our research” stays in the past. “Yesterday we entered the library, find a quiet table, and began our research” unexpectedly switches to present. Correct it to “found.” A shift may be appropriate when stating a continuing fact: “We measured the plant last week and learned that it grows toward light.” *Measured* and *learned* describe past events; *grows* states a present general truth.

### Practice 3

Choose the correct form, then name the subject or explain the time shift.

1. “A box of old photographs (was/were) under the bed.”
2. “Each of the students (bring/brings) a notebook.”
3. “Last month we visit the museum and sketched one sculpture.”
4. Revise to make the ongoing fact clear: “The class tested how water freezes and discovered that pure water froze at about zero degrees Celsius under ordinary conditions.”

Do not confuse a verb’s spelling with its tense. “She studies” is present; “she studied” is past. The *-ies* change is a spelling pattern used to form the present-tense verb, not evidence of a different time.

## Chapter 4 — Connect ideas so the logic is visible

Coordination gives two ideas similar weight. Use *and* to add, *but* to contrast, *or* to present a choice, and *so* to show a result. “The path was muddy, but we continued carefully.” The contrast word *but* signals that continuing was unexpected given the muddy path. A different connector changes the relationship: “The path was muddy, so we continued carefully” suggests that the mud caused the careful movement.

Subordination makes one clause depend on another and indicates which idea is background, time, cause, condition, or contrast. “Because the path was muddy, we walked carefully” presents the reason first. “We walked carefully because the path was muddy” gives the main action first. Both are correct, but emphasis differs. Put a comma after an introductory dependent clause; when the dependent clause follows the main clause, a comma is often unnecessary unless needed to prevent confusion or for a specific stylistic reason.

Avoid linking every thought with *and*. A chain such as “We opened the file and read the note and found a date and called the office” may be grammatically possible but tiring. Separate steps or use a connector that shows logic: “We opened the file and read the note. Because it listed an unfamiliar date, we called the office to confirm it.” Do not choose a connector merely to make a sentence longer. Verify that it expresses the relationship you intend.

Sentence variety is not a contest to write the longest sentence. A short sentence can emphasize a key point. A longer sentence can show how details relate, provided the reader can follow its structure. Read the paragraph aloud and pause where the ideas change. If you run out of breath or lose the main subject, divide the sentence or move a detail.

## Chapter 5 — A complete revision and transfer sequence

Use three passes rather than trying to fix everything at once. **Pass one: meaning.** Identify the audience, purpose, and main point. Check that each sentence contributes and that facts are in the intended order. **Pass two: sentence structure.** Underline each clause’s subject and verb; mark fragments, run-ons, and unclear pronouns. Then review connectors, agreement, and tense. **Pass three: words and mechanics.** Replace genuinely vague words, check spelling and punctuation, and read the final paragraph aloud. Editing is not just catching errors: each change should make meaning more accurate or easier to follow.

**Model paragraph, before:** “Last Tuesday the science club were testing paper bridges. Because the first design sagged. Omar changed the folds he added another layer, it held more coins. This showed it was better. The team writes the results in a notebook and agreed to test a wider bridge.”

**Revision:** “Last Tuesday, the science club tested paper bridges. The first design sagged, so Omar changed the folds and added another layer. The revised bridge held more coins than the first design. That result showed that the changes improved its strength under the test conditions. The team wrote the results in a notebook and agreed to test a wider bridge next.”

**Why these revisions help:** *Club* is treated as a singular collective noun in this sentence, so *tested* replaces *were testing*. The dependent fragment beginning with *because* is attached to its result using *so*. The comma splice between “he added another layer” and “it held more coins” is repaired by reorganizing the clauses. *This* and *it* are replaced with the specific result and bridge to remove ambiguity. Past-tense verbs report what happened Tuesday; *agreed* replaces *agreed* as the second past-tense action alongside *wrote*. “Under the test conditions” avoids claiming that a single test proves a bridge is always stronger. The comparison is made explicit: the revised bridge held more coins than the first design.

### Cumulative transfer task

Write a 120–160 word explanation for a new student describing how to prepare for a short class presentation. Include at least one sequence word, one cause or condition, and one specific example. Then revise it using the three passes above. Mark one sentence you changed for meaning, one for sentence structure, and one for word choice or mechanics. Check that each pronoun has a clear reference, subjects agree with verbs, and the tense stays consistent. Compare your first and final versions: explain which revision most improved clarity and why. There is no single model paragraph because the advice and examples can differ; the answer is successful when it is accurate, organized, and readable.

### Answer key and explanations

**Practice 1:** (1) Fragment: attach it to a main thought, for example, “While the class waited in the hallway, the teacher prepared the room.” (2) Comma splice: “The garden was dry, so the volunteers carried water,” or “The garden was dry; the volunteers carried water.” (3) Run-on: “I checked the instructions, then I started the experiment,” or “I checked the instructions before starting the experiment.” (4) The second sentence is a dependent fragment; combine it: “The shop was closed because it was a holiday.” The period can remain only if the second thought is rewritten as a complete sentence: “It was a holiday.”

**Practice 2:** (1) Possible answers include “The bird flew over the fence” and “The bird hopped over the fence”; the verbs suggest different movement. (2) *Advise* is the verb: “I will advise you…” *Advice* names the recommendation. (3) Clarify who found the notebook: “Nora thanked Mei after Nora found the missing notebook,” or “Nora thanked Mei, who had found the missing notebook.” Choose the intended finder. (4) “Could you please send me the schedule?” is polite and appropriate for a formal request; “Please send me the schedule when you have a chance” is another option.

**Practice 3:** (1) *Was*: the subject is singular *box*. (2) *Brings*: *each* is singular. (3) “Last month we visited the museum and sketched one sculpture”: both actions occurred in the past. (4) “The class tested how water freezes and discovered that pure water freezes at about zero degrees Celsius under ordinary conditions.” The testing and discovery happened in the past; the scientific generalization uses present tense. Check a particular science task against its stated conditions rather than treating every sample or measurement as identical.

### Suggested study sequence

Complete four focused sessions of about 60 minutes each. Session 1: read Chapters 1–2, annotate the model repairs, and complete Practice 1–2; check each answer and write why the revision works (60 minutes). Session 2: study agreement, tense, connectors, and the remaining examples; complete Practice 3 and correct it in a different colour (60 minutes). Session 3: find a short paragraph from your own class notes or a teacher-approved text. Mark sentence boundaries, subjects and verbs, pronoun references, and words that could be more precise. Revise it in separate passes for meaning, structure, and mechanics, then explain three edits (60 minutes). Session 4: complete the cumulative transfer task without looking at the examples; use the answer key to diagnose gaps, revise once, and write a short reflection on which rule you will check next time (60 minutes). Total: approximately 240 minutes, including reading, deliberate practice, writing, feedback, and correction.`,
    estimatedMinutes: 240,
    sources: [
      {
        title: "Purdue OWL: Grammar",
        url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html",
      },
      {
        title: "Purdue OWL: The Writing Process",
        url: "https://owl.purdue.edu/owl/general_writing/the_writing_process/index.html",
      },
    ],
  },
  "foundations-reading": {
    title: "Academic Reading & Grammar: Read for Meaning, Evidence, and Structure",
    summary:
      "A guided method for approaching challenging school texts: preview, annotate purposefully, distinguish claims from evidence, summarize fairly, and use grammar clues to interpret relationships.",
    objectives: [
      "Preview a text and set a question that supports a purposeful first reading.",
      "Identify a central claim or main idea, supporting evidence, and the writer’s reasoning.",
      "Use paragraph structure, transitions, pronouns, and sentence patterns to track relationships.",
      "Infer an unfamiliar word from context, then confirm the meaning without losing the passage’s argument.",
      "Write a concise, accurate summary and evaluate what a source does and does not establish.",
    ],
    body: `## Chapter 1 — Give each reading a purpose

Academic reading is active work: you make and test ideas as you move through a text. Before reading every line, establish why you are reading. A history chapter, a science explanation, and a short argument may all require different questions. If an assignment asks how a local wetland reduces flooding, your guiding question is not simply “What is this chapter about?” It is “Which features of the wetland slow or store water, and what evidence supports that explanation?”

Begin with a short preview. Read the title, headings, opening and closing paragraphs, captions, and any diagram labels. Notice the author, date, and source when provided. A preview is not a substitute for reading; it is a map that helps you predict where useful information may appear. Turn the assignment into one or two questions, then read the relevant sections carefully. If you have no assigned question, make one: “What problem does the author identify?” or “How does the process work?”

Set a manageable purpose for each pass. A first pass can locate the overall topic and structure. A second pass can track a specific claim or process. A final pass can check details and take notes. This is more effective than highlighting every sentence on the first reading. If a paragraph becomes confusing, slow down at the paragraph rather than restarting the entire chapter.

Use the title to predict the subject, then revise your prediction if the text leads somewhere else. A heading called “A different kind of evidence” may signal a contrast with the previous section. You might jot “new evidence type” in the margin, not copy the whole paragraph. Keep questions brief and answerable from the text.

## Chapter 2 — Find the main idea and the work each paragraph does

The topic is what a text discusses; the main idea is the important point it makes about that topic. A passage about city trees might focus on shade, air quality, maintenance, or all three. Do not confuse a repeated word with the author’s central message. Read the title and opening, then ask: “What does the author want me to understand about this topic?” Check the final paragraph and the evidence before settling on an answer.

A paragraph often develops one main point. Its first sentence may state that point, but topic sentences can also appear later or remain implicit. Details, examples, definitions, and explanations support or clarify the point. Consider this short passage:

### Worked example — Separate claim, evidence, and qualification

> A row of trees can reduce direct sunlight on a paved street. In one neighborhood study, shaded pavement reached a lower afternoon surface temperature than nearby unshaded pavement. Trees also provide places for birds and insects, although the benefits depend on species and care.

The first sentence offers a claim about shade. The second gives a reported comparison as evidence, though a reader would need the study’s methods and sample to assess its strength. The last sentence adds a second benefit and a qualification. A fair main-idea statement might be: “Street trees can provide shade and habitat, but their effects depend on local conditions.” “Trees are nice” is too broad; “the pavement was cooler” is only one detail.

Track how each paragraph contributes to the whole. A writer might define a problem, describe a cause, present evidence, respond to a counterargument, and propose a solution. Label the job in a few words: *problem*, *example*, *contrast*, *limitation*, *proposal*. These labels are more useful than a page full of copied sentences because they preserve structure.

### Practice 1 — Map the paragraph

Read the following:

> A school garden can make science lessons more concrete. Students can compare how seedlings grow in different amounts of light and record changes over several weeks. However, a garden is not a controlled laboratory: weather, soil, and pests may affect the results. Teachers can use those complications to discuss why scientists repeat trials and keep notes about conditions.

1. State the main idea in one sentence.
2. Identify one example of supporting detail.
3. What limitation does the writer acknowledge?
4. What role does the final sentence play?

Answer in your own words, then check the key. A paraphrase should keep the author’s point rather than copying individual phrases.

## Chapter 3 — Separate claim, evidence, and reasoning

A claim is a statement the writer asks readers to accept. Evidence is information offered in support: observations, measurements, examples, documents, or expert findings. Reasoning explains why that evidence supports the claim. In an argument about a school’s later start time, “A later start would help students” is a claim. A schedule comparison or an attendance record could be evidence. The reasoning might explain how a later bus route changes arrival time or why a specific attendance pattern matters.

Do not treat these parts as interchangeable. A vivid example may illustrate a claim without showing that it is true for everyone. A statistic may seem convincing but be incomplete without its source, date, sample, or measurement method. Ask: Who collected the evidence? What was measured? How many cases were included? Does the conclusion stay within the evidence’s limits? These questions are not reasons to reject a text automatically; they help you judge what it can support.

Look for qualifiers such as *some*, *often*, *may*, and *in this sample*. They limit a claim. “The program may improve attendance for students who participate” is more cautious than “The program improves attendance for all students.” When summarizing, retain important limits. Removing *may* or *in this sample* can turn a careful claim into an unsupported universal statement.

Compare two interpretations of evidence. Suppose a report says that 18 of 24 students completed an optional reading log. “Most students who joined the trial completed the log” matches the numbers. “The log made every student a stronger reader” does not: the report describes completion, not reading growth, and does not include every student. Strong readers distinguish what a source measured from what they hope it means.

### Practice 2 — Test the inference

A class tries a new review routine for one week. In a quiz the following Friday, 16 of 20 students score higher than they did on a quiz the week before.

1. Write one cautious claim supported by this information.
2. Name one conclusion the information alone cannot establish.
3. List two details you would want before deciding whether the routine caused the higher scores.

## Chapter 4 — Let grammar reveal relationships

Grammar is not only a set of correctness rules; sentence structure gives clues about meaning. Connectors show how ideas relate. *Because* introduces a reason, *although* introduces a contrast or concession, *for example* signals illustration, and *therefore* signals a conclusion. In “The sample was small, although the pattern was consistent,” the writer admits a limitation while preserving a qualified observation. If you replace *although* with *because*, you claim that a small sample caused the pattern. That is a different argument.

Pay attention to pronoun references. In “The researchers compared two schedules, and they found a difference,” *they* refers to the researchers. In “The researchers compared two schedules, and it differed,” *it* is unclear: a schedule or the comparison? When a pronoun could point to more than one noun, reread the previous sentence and identify the intended referent. If the ambiguity remains, a reader should not invent an answer.

Notice how a sentence’s grammar signals certainty and time. “The results show…” makes a present claim about current evidence; “the results showed…” places the finding in a past report. Modal verbs such as *could*, *might*, and *must* indicate possibility, uncertainty, or necessity. They matter in academic writing. “The observation might indicate a change” is not the same conclusion as “The observation proves a change.”

Long sentences can contain several layers. Find the main clause first, then inspect phrases and subordinate clauses. In “Although the first trial produced uneven results, the team repeated the measurement after checking the equipment,” the main action is *the team repeated the measurement*. The opening *although* clause sets up a contrast. The phrase *after checking the equipment* gives timing and does not create another full main clause. Bracketing clauses mentally can help prevent a complex sentence from seeming like a list of unrelated ideas.

Punctuation also signals structure. A colon can introduce an explanation or list after a complete clause: “The team recorded three conditions: light, water, and temperature.” A semicolon can join closely related complete clauses. Punctuation supports the reading but does not replace understanding; when you are unsure, paraphrase the two ideas in plain words.

## Chapter 5 — Vocabulary in context and responsible notes

When you meet an unfamiliar word, do not stop at the first possible definition. Read the sentence, the sentences around it, and any example or contrast. Identify the word’s grammatical job: a noun, verb, or adjective? Replace it mentally with a likely meaning and see whether the sentence still makes sense. Then check a reliable dictionary or glossary if precision matters. Academic words often have a general meaning and a field-specific meaning. *Cell*, for instance, can refer to a small room, a biological unit, or a spreadsheet location; context selects the appropriate sense.

Keep notes in your own words. A useful note is short enough to review and precise enough to reconstruct the idea. Record a page or section location beside an exact quotation, and use quotation marks for language copied word for word. If you paraphrase, change the structure as well as the wording while preserving meaning; swapping a few synonyms into the same sentence is not a genuine paraphrase. For a school task, follow the teacher’s citation directions.

Try a three-column note: **claim or question**, **evidence or answer**, **my connection or uncertainty**. For the wetland question, a note might say: “Claim: wetland plants and soil can slow runoff; evidence: author describes water spreading through a shallow marsh; question: does the text compare storm sizes?” The question column prevents an unverified gap from becoming a remembered fact.

## Chapter 6 — Summarize, check, and transfer

A summary states the central idea and the most important supporting points in fewer words than the original. It does not include every example, your opinion, or a conclusion that the author did not make. Draft it by closing the text or looking away from it, stating the main point from your notes, then reopening the source to check accuracy. Keep qualifiers, causes, and contrasts intact.

**Model summary.** For the garden paragraph in Practice 1: “A school garden gives students a concrete setting to observe plant growth, while variable outdoor conditions can complicate experiments. Teachers can use those limits to teach careful recording and repeated trials.” This includes the benefit, the limitation, and the teaching implication without copying the passage line by line.

When a text is unclear, use a repair routine: pause; reread the sentence before and after; identify unfamiliar words; locate the main verb and subject; mark a connector or pronoun; then write a one-line paraphrase. If the paraphrase conflicts with the writer’s next paragraph, revise it. Readers are allowed to update an interpretation when new information appears.

### Cumulative transfer task

Choose a short school text in science, history, or another class (about three to six paragraphs). Write its title and source, then complete the following: (a) form one guiding question before reading; (b) label each paragraph’s role in a few words; (c) state the central idea in one sentence; (d) record one claim, its evidence, and the reasoning that connects them; (e) identify one qualifier, transition, or pronoun that affects interpretation; and (f) write a 60–90 word summary that preserves the author’s limits. Finish with one question the text does not answer. Your answer is accurate if another reader can locate the cited evidence and see that your summary does not claim more than the source.

### Answer key and explanations

**Practice 1:** (1) A garden can make science observable, while its natural variability also creates useful lessons about careful experimentation. (2) Students compare seedlings under different light conditions and record changes; that is a concrete example. (3) Weather, soil, and pests can affect the outcome, and the garden is not a controlled laboratory. (4) The final sentence explains a teaching use for those complications: it connects the limitation to repeated trials and record-keeping. A response that says only “gardens help science” misses the acknowledged limit.

**Practice 2:** (1) “In this one-week class trial, 16 of 20 students scored higher on the later quiz than on the earlier quiz.” This reports exactly what was observed without claiming a cause. (2) The figures alone do not prove that the routine caused the higher scores, that students learned permanently, or that all students would benefit. (3) Helpful details include whether both quizzes covered comparable material, prior practice or instruction, whether the same students took both, how scores were measured, and whether there was a comparison group. Any two relevant details earn credit because they help assess alternative explanations or measurement quality.

**Transfer task:** Answers depend on the chosen source. Check that the guiding question comes before the reading; the paragraph labels describe each paragraph’s job rather than just repeating its topic; the claim and evidence can be found in the source; and the summary keeps uncertainty words and does not add outside conclusions. An unanswered question should be a genuine gap, not a detail explicitly addressed in the text.

### Suggested study sequence

Complete four sessions of about 60 minutes each. Session 1: read Chapters 1–2, annotate the model think-aloud, and complete Practice 1 with a new short passage (60 minutes). Session 2: work through claims, evidence, reasoning, and vocabulary; complete Practice 2 and verify every quotation or paraphrase against its source (60 minutes). Session 3: choose a teacher-approved text from another subject. Map each paragraph’s role, write a one-sentence central idea, identify two claims and their evidence, and prepare a 60–90 word summary. Check that the summary preserves qualifiers and does not add claims (60 minutes). Session 4: complete the cumulative transfer task with a different text, then use the answer key to revise and explain one remaining uncertainty. Finish by making three questions that would help you read the next unfamiliar text (60 minutes). Total: approximately 240 minutes, including careful reading, evidence checking, writing, and revision.`,
    estimatedMinutes: 240,
    sources: [
      {
        title:
          "Improving Adolescent Literacy: Effective Classroom and Intervention Practices",
        url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/21",
      },
      {
        title: "Purdue OWL: Grammar",
        url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html",
      },
    ],
  },
  "foundations-spelling": {
    title: "English Usage & Editing: Make Every Revision Count",
    summary:
      "A hands-on editing course for spelling patterns, commonly confused words, punctuation, sentence boundaries, and a dependable proofreading routine that protects meaning.",
    objectives: [
      "Apply common English spelling patterns while recognizing that exceptions and word origins matter.",
      "Distinguish commonly confused words by their grammatical role and meaning.",
      "Use capitalization, apostrophes, commas, and end punctuation to make sentence structure readable.",
      "Revise an error-filled passage in focused editing passes and explain corrections.",
      "Proofread a new piece of writing using a sequence that finds both mechanical errors and unclear meaning.",
    ],
    body: `## Chapter 1 — Edit in passes, not by guessing

Editing improves accuracy and readability; it is not a search for reasons to distrust your writing. A reliable sequence reduces the number of decisions you are trying to make at once. First, check meaning and organization: does each sentence say what you intend? Next, check sentence boundaries and grammar. Then check spelling, capitalization, and punctuation. At the end, read a printed or otherwise visually changed copy slowly. If you correct every kind of issue at the same time, a word-level fix can distract you from a missing idea or an incomplete sentence.

Proofreading is the final close check, not a replacement for revision. Revision can involve moving, adding, or removing ideas. Editing checks sentence-level choices and usage. Proofreading catches remaining errors in the finished version. A familiar passage can be hard to proofread because your brain remembers what you intended to write and may skip a missing word. Change the conditions: read from the end one sentence at a time for spelling, cover the lines below the one you are checking, or ask another reader to identify places where the meaning is unclear.

Keep a personal list of recurring errors. If you often confuse *its* and *it’s*, check those forms deliberately. If you omit words while copying, compare each line with the original. A checklist should target your actual patterns; a generic list is only a starting point. Do not accept every automated suggestion without review. A spell-checker may not recognize that a correctly spelled word is wrong in context, and a grammar tool may mistake an intentional style choice for an error.

## Chapter 2 — Notice spelling patterns and test the word

English spelling reflects sound, word structure, and word history. Patterns are useful guides, not promises that every word behaves the same way. When you are unsure, pronounce the word, break it into syllables or meaningful parts, and check a trusted dictionary. Look for a familiar base, prefix, or suffix. *Unhelpful* can be understood as *un-* + *help* + *-ful*. Seeing the parts can help with both spelling and meaning.

One common pattern is dropping a final silent *e* before a vowel suffix: *hope* becomes *hoping* and *make* becomes *making*. Keep the *e* before many consonant suffixes: *hopeful*. There are exceptions, and letters may change for other reasons; use the pattern to make a first attempt, then verify unfamiliar words. When adding *-ed* to a word ending in silent *e*, usually add only *d*: *arrive* becomes *arrived*.

For some short words ending in consonant–vowel–consonant, double the final consonant before a vowel suffix: *stop* becomes *stopping* and *stopped*. Do not double every final consonant. The pattern depends on the word’s pronunciation, stress, and ending; compare *visit* and *visiting*, where the final consonant is not doubled. Longer words can have different stress patterns, so a dictionary or classroom word list is better than an overconfident rule.

When a word ends in consonant plus *y*, the *y* often changes to *i* before *-es* or many other suffixes: *try* becomes *tries*, and *happy* becomes *happier*. Before *-ing*, keep the *y*: *trying*. After a vowel plus *y*, keep the *y* when adding endings: *play* becomes *plays* and *played*. These patterns explain many common forms, but they do not replace checking an irregular word such as *said* or *does*.

### Practice 1 — Apply the pattern, then verify

Write the requested form and name the pattern when one applies.

1. *hope* + *-ing*
2. *stop* + *-ed*
3. *try* + *-es*
4. *play* + *-ed*
5. *visit* + *-ing*

After answering, check the forms in a dictionary or reliable class reference if you are uncertain. This practice is about noticing how forms are built, not memorizing a claim that English has no exceptions.

## Chapter 3 — Choose between words that sound alike

Homophones sound alike but have different spellings and meanings. The best check is not “Which spelling looks familiar?” but “What job does the word do here?” *Their* shows possession (“Their notebooks are on the desk”); *there* points to a place or introduces a phrase (“Put the notebooks there”; “There are two notebooks”); *they’re* means *they are* (“They’re ready”). To test *they’re*, expand it to *they are*. If the sentence still makes sense, the contraction may fit.

*Your* shows possession (“Your answer is clear”), while *you’re* means *you are* (“You’re ready”). *Its* shows possession (“The bird lifted its wings”); *it’s* means *it is* or *it has* (“It’s raining”; “It’s been a long day”). The apostrophe in a contraction marks missing letters, not ownership. This is why *it’s tail* is not correct when you mean a tail belonging to it.

Other pairs depend on grammatical role. *To* may mark direction or introduce an infinitive (“walk to school,” “to learn”). *Too* means “also” or “more than needed” (“I want to come too”; “too noisy”). *Two* names the number. *Then* commonly refers to time or sequence; *than* introduces a comparison. Read the entire phrase: “We finished, then we left”; “This route is shorter than the other route.”

Words may sound alike without having identical grammatical jobs. *Affect* is often a verb meaning to influence: “Noise can affect concentration.” *Effect* is often a noun meaning a result: “The effect was noticeable.” There are less common uses in both cases, so the sentence’s grammar is a practical first clue, not an absolute definition. If uncertain, replace the word with a plain explanation: “influence” or “result.” The word that preserves the sentence’s meaning is the better choice.

### Practice 2 — Choose and explain

1. “___ going to place ___ books over ___.”
2. “The sudden change did not ___ the final result.”
3. “The ___ of the new routine was that we finished earlier.”
4. “We finished the outline, ___ we checked the facts.”
5. “This path is longer ___ the one beside the gym.”

Expand contractions or substitute a meaning such as *influence*, *result*, or *after that*. Explaining the check makes it easier to catch the same error in a new sentence.

## Chapter 4 — Use punctuation to show boundaries and ownership

Capitalization tells readers where sentences and proper names begin. Capitalize the first word of a sentence and the names of specific people, places, organizations, and days or months: *Maya*, *Lake Erie*, *Northview Library*, *Tuesday*. Do not capitalize a general noun simply because it feels important: *the library* is not a specific name unless it is part of the institution’s formal name. Titles are usually capitalized according to the style guide used for the assignment; follow the teacher’s or publisher’s convention.

An apostrophe has two main jobs: marking a contraction or showing possession. In a singular noun, add apostrophe plus *s*: “the student’s folder.” For a plural noun that already ends in *s*, add an apostrophe after the *s*: “the students’ folders.” For an irregular plural not ending in *s*, add apostrophe plus *s*: “the children’s coats.” Ask whose item it is, then identify whether the owner is singular or plural. Do not add apostrophes to ordinary plurals: “three books,” not “three book’s.”

Commas can separate items in a series, set off an introductory phrase, and join two independent clauses when paired with a coordinating conjunction. “Before the rehearsal, the cast checked costumes.” “We packed pencils, paper, and water.” “The rehearsal ended, and the cast went home.” The comma before *and* in a series is called the serial or Oxford comma; usage varies among style guides, so be consistent with the style requested. The important goal is that the list be clear.

A comma does not replace a period between complete sentences. “The lights dimmed, the play began” is a comma splice. Repair it with a period (“The lights dimmed. The play began”), a semicolon (“The lights dimmed; the play began”), or a comma and conjunction (“The lights dimmed, and the play began”). Do not insert a comma wherever you would pause while speaking. A comma between a subject and its verb can break the sentence: “The students in the front row, asked a question.” Remove the comma: the full subject is *the students in the front row*.

Quotation marks enclose exact spoken or copied words, while the surrounding sentence tells who said them: “ ‘Bring your notebook,’ said Lila” is often formatted with double quotation marks in standard U.S. usage: “Bring your notebook,” said Lila. Punctuation placement around quotation marks differs by language and style conventions. Use the convention required for the assignment and do not change the words inside a quotation when copying them.

## Chapter 5 — A worked edit with reasons

**Draft:** “On friday, our class visited the city museum. The guide showed us two exhibit’s, we were especially interested in the map room. Its display explained how the river changed it’s course over time. Your able to compare the old map to a new map and notice that the roads were not always where they are now. After the tour we wrote notes and then we shared them with our partner.”

**Revised version:** “On Friday, our class visited the city museum. The guide showed us two exhibits, and we were especially interested in the map room. Its display explained how the river changed its course over time. You’re able to compare the old map with a newer map and notice that the roads were not always where they are now. After the tour, we wrote notes, and then we shared them with our partners.”

**Explanation:** *Friday* is capitalized because it is a day name. *Exhibits* is a plural, so it needs no apostrophe. The original joined two complete clauses with only a comma; adding *and* repairs the comma splice and shows that the second thought adds information. *Its* is possessive, describing the display’s subject; *it’s* would expand to *it is*, which does not fit before *course*. *You’re* expands to *you are*, so it fits before *able*. “Compare the old map with a newer map” is a conventional phrasing; *compare … to* is also widely used, and the important correction here is not a rigid prohibition but clarity and consistency. The comma follows the introductory phrase “After the tour.” *Partners* makes the plural group clear if the notes were shared with more than one partner; if every student shared with exactly one partner, “partner” may be right. Always preserve the intended facts rather than changing them to match a guessed rule.

The revision also changes *a new map* to *a newer map*. That comparison is appropriate only if the map is newer than the old map; if its date is unknown, write “a second map” instead. Editors must check facts, not just mechanics. In a final check, compare each correction with the intended meaning and the assignment’s style.

### Practice 3 — Edit without changing facts

Correct this paragraph. There may be more than one good punctuation choice.

> “last saturday, we visited the nature center. The guide said the turtles shell was damaged, but it’s owner had brought it to the center. We watched the staff place the turtle in a quiet enclosure, they recorded the time and checked its tag. Your not supposed to handle wild animals, so we asked questions from a safe distance. Afterward we wrote about what we learned in our journals”

Mark each correction, then write one sentence explaining why you made it. If a phrase is unclear, preserve the facts and revise only what the text supports.

## Chapter 6 — Proofread with a deliberate routine

Use this order for a finished assignment:

1. **Read for meaning.** Can you tell what each sentence says? Check names, dates, quantities, and pronoun references against your notes. Do not silently “correct” facts you have not verified.
2. **Check sentence boundaries.** Find each subject and verb. Look for fragments, run-ons, and comma splices. Confirm that the paragraph is divided where the topic changes.
3. **Check usage.** Search deliberately for words you often confuse, verb forms, agreement, and consistent tense. For a frequently misused pair, test the grammatical role or expand the contraction.
4. **Check spelling and punctuation.** Read more slowly than usual. Check proper names, apostrophes, commas, end punctuation, and the spelling of unfamiliar words in a dictionary.
5. **Make a final clean read.** Read aloud or have a trusted reader follow along. Ask the reader to mark a confusing place, not rewrite your ideas. Make sure each change improves the intended meaning.

If a digital tool flags a sentence, ask what rule it thinks applies. Accept the suggestion only if it fits the context, meaning, and expected style. A checker can find a repeated word, but it may not know whether *their* or *there* is intended. A dictionary can confirm spelling and meaning, but the writer still has to select the correct word for the sentence.

### Cumulative transfer task

Write a 100–140 word report about a familiar process: how to borrow a book, prepare a snack, organize a study space, or another safe everyday activity. Include an ordered set of steps and at least one reason. Then edit in three passes: meaning and order; sentence boundaries and grammar; spelling, word choice, and punctuation. Circle one word pair you checked, underline one sentence boundary you repaired or verified, and write a short note explaining why each change was needed. Finally, ask a partner to identify one sentence that could be clearer. Revise only if the feedback matches your intended meaning. The report is successful when the steps are logical, words are used correctly, and punctuation helps a reader follow the process.

### Answer key and explanations

**Practice 1:** (1) *Hoping*: drop the silent *e* before vowel suffix *-ing*. (2) *Stopped*: double the final consonant in this short consonant–vowel–consonant word before *-ed*. (3) *Tries*: consonant plus *y* changes to *i* before *-es*. (4) *Played*: after a vowel plus *y*, keep the *y* and add *-ed*. (5) *Visiting*: do not double the final consonant in this word; the short-word doubling pattern does not apply. The forms are the answers; dictionary checking is appropriate for unfamiliar examples.

**Practice 2:** (1) “They’re going to place their books over there.” *They’re* = *they are*; *their* marks ownership; *there* indicates a place. (2) *Affect*: the verb means influence. (3) *Effect*: the noun is the result. (4) *Then* means next in sequence. (5) *Than* introduces the comparison.

**Practice 3:** “Last Saturday, we visited the nature center. The guide said the turtle’s shell was damaged, but its owner had brought it to the center. We watched the staff place the turtle in a quiet enclosure, and they recorded the time and checked its tag. You’re not supposed to handle wild animals, so we asked questions from a safe distance. Afterward, we wrote about what we learned in our journals.” Capitalize *Last* and *Saturday*. *Turtle’s* marks a shell belonging to one turtle; *its* is possessive, not the contraction *it’s*. A comma and *and* join the two complete clauses about watching and recording; “The staff recorded the time and checked its tag while we watched…” is another possible revision, but only if it preserves the intended timing. *You’re* means *you are*. Add a comma after introductory *Afterward* and end the final sentence with a period. The guide may have said something different, and the text does not identify whether *it* refers to the turtle or an item; an editor should clarify the reference if it is unclear in context rather than inventing a new fact.

**Transfer task:** There is no single required report. Check that the steps follow a sensible sequence, at least one reason explains a choice, the selected word pair fits its grammatical role, and each sentence boundary is complete. The revision note should name the actual change and its purpose, such as “I replaced *your* with *you’re* because the sentence means ‘you are.’” Do not mark a change as correct merely because a proofreading tool suggested it.

### Suggested study sequence

Complete four sessions of about 60 minutes each. Session 1: study spelling patterns and complete Practice 1; create a personal list of uncertain words and verify them with a dictionary (60 minutes). Session 2: learn the commonly confused words and punctuation distinctions; complete Practice 2–3, explaining the grammatical role of every selected word (60 minutes). Session 3: edit the model paragraph using separate meaning, sentence-structure, and mechanics passes. Then edit a different teacher-approved paragraph and mark which changes improve meaning versus only surface correctness (60 minutes). Session 4: write and edit the cumulative transfer task without copying a model. Review the answer key, ask a peer to identify one unclear sentence if available, and make a final revision that preserves intended meaning (60 minutes). Total: approximately 240 minutes, including study, repeated application, independent editing, and feedback.`,
    estimatedMinutes: 240,
    sources: [
      {
        title: "Purdue OWL: Grammar",
        url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html",
      },
      {
        title: "Purdue OWL: The Writing Process",
        url: "https://owl.purdue.edu/owl/general_writing/the_writing_process/index.html",
      },
    ],
  },
};
