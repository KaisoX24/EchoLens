from reasoning.llm_client import get_text_model

def clean_text(raw_text: str) -> str:
    model = get_text_model()
    prompt = f"""You are formatting text for a student to LISTEN to, not summarizing it.
    
                CRITICAL RULE: Keep all actual informational content, facts, definitions, and details exactly as meaningful as the original. Do not shorten, condense, or omit any real course content. This text will be studied from — missing details could cost the student marks.

                What TO fix:
                - Remove page navigation artifacts: dot leaders (....), stray page numbers, running headers
                - Remove markdown formatting symbols entirely (**, *, -, #, etc.) — this is spoken text, not displayed text, so bold/bullet symbols have no meaning here. Rewrite bullet lists as flowing sentences instead.
                - Convert mathematical notation and LaTeX (anything with \\[ \\], \\sum, \\left, underscores/carets for sub/superscripts, etc.) into plain spoken English. For example, "y = wx + b" should become "y equals w times x plus b", and a summation should be described in words, not symbols.
                - If text is a flattened table (data that reads as a confusing run-on list of labels and values), restructure it into clear sentences — but keep every value and label, don't drop any
                - If this page is PURELY a table of contents or index with no real content, you may summarize it briefly (e.g. "This page lists the table of contents covering topics 1 through 9")

                What NOT to do:
                - Do not paraphrase or shorten actual lecture/course content
                - Do not remove details, examples, or explanations
                - Do not add information that isn't in the original
                - Do not leave any markdown symbols or raw LaTeX syntax in the output — none of it should appear literally in your response

                Text: {raw_text}
                """
    response = model.invoke(prompt)
    return response.content
