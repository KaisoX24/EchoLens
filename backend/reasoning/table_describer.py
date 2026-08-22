from backend.reasoning.llm_client import get_table_model
from backend.schemas.schemas import DescriptionList

def describe_tables_batch(all_rows: list[list[list[str]]]) -> list[str]:
    if not all_rows:
        return []

    model = get_table_model().with_structured_output(DescriptionList,method='json_mode')

    prompt = f"""You will receive {len(all_rows)} table(s) as raw row data.
                Convert each into one natural spoken-language description (flowing sentences, not a grid re-listing).

                Respond with a JSON object using EXACTLY this structure, with the key "descriptions" (always plural, always a list, even if there is only one table):

                {{"descriptions": ["first description here", "second description here"]}}

                You must return exactly {len(all_rows)} string(s) inside the "descriptions" list, in the same order as the tables below.
                """

    for i, rows in enumerate(all_rows):
        prompt += f"Table {i+1}: {rows}\n\n"

    result = model.invoke(prompt)
    return result.descriptions
