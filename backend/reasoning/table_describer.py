# reasoning/table_describer.py
from backend.reasoning.llm_client import get_table_model
from backend.schemas.schemas import DescriptionList

def describe_tables_batch(all_rows: list[list[list[str]]]) -> list[str]:
    if not all_rows:
        return []

    model = get_table_model().with_structured_output(DescriptionList)

    prompt = f"""You will receive {len(all_rows)} table(s) as raw row data.
                Convert each into one natural spoken-language description (flowing sentences, not a grid re-listing).
                Return exactly {len(all_rows)} descriptions, in the same order as the tables below.
                """
    for i, rows in enumerate(all_rows):
        prompt += f"Table {i+1}: {rows}\n\n"

    result = model.invoke(prompt)
    return result.descriptions