from app.models.snapshot import Snapshot
from app.services import notification_service
from app.services.template_service import find_templates_by_scope
from app.core.logger import get_logger
from app.services.notification_checker import (
    ConditionEvaluator,
    NewErrorChecker,
    DelayChecker,
    StreakChecker,
    FinalDecisionHandler,
)


logger = get_logger(__name__)


def setup_notification_chain():
    condition_evaluator = ConditionEvaluator()
    new_error_notifier = NewErrorChecker()
    delay_checker = DelayChecker()
    streak_checker = StreakChecker()
    final_decision_handler = FinalDecisionHandler()

    # Link the handlers
    condition_evaluator.set_next(streak_checker).set_next(new_error_notifier).set_next(delay_checker).set_next(
        final_decision_handler
    )

    return condition_evaluator


chain_head = setup_notification_chain()


async def process_snapshot(snapshot: Snapshot):
    logger.info(f"Processing snapshot for {snapshot.slug}")
    # Find all templates that should be triggered by this snapshot's slug
    templates = await find_templates_by_scope(snapshot.slug, True)
    logger.info(f"Templates: {templates}")

    for template in templates:
        # Process the snapshot through the chain of responsibility
        should_notify = await chain_head.handle(snapshot, template)

        # Log the decision (this could also involve more complex logic like storing decision history)
        logger.info(
            f"Notification decision for template {template.id} with snapshot {snapshot.id}: {'Send' if should_notify else 'Do not send'}"
        )

        # If notification should be sent, this can be where we also handle the sending
        if should_notify:
            await notification_service.create_notification(template.id, snapshot.slug, snapshot.timestamp)
