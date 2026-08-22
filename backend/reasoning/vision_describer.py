import base64
from reasoning.llm_client import get_vision_model
from schemas.schemas import DescriptionList
from langchain.messages import HumanMessage


def describe_images_batch(images: list[tuple[bytes, str]]) -> list[str]:
    if not images:
        return []

    model = get_vision_model().with_structured_output(DescriptionList)

    content = [{
        "type": "text",
        "text": f"""You will receive {len(images)} image(s) from the same document page, in order.
                For each image, describe the chart, diagram, or visual for a visually impaired student —
                explain the actual trend, comparison, or relationship shown, not just the visual type.
                Include specific values or labels if visible. 2-4 sentences each, direct, no hedging.
                Return exactly {len(images)} descriptions, in the same order as the images."""
                    }]

    for image_bytes, ext in images:
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image_url",
            "image_url": f"data:image/{ext};base64,{b64_image}"
        })

    message = HumanMessage(content)
    result = model.invoke([message])
    return result.descriptions
