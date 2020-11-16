export const actionName = actionParameter => ({
    type: 'ACTION_TYPE',
    actionParameter
})

export const updateHistory = history => ({
    type: 'UPDATE_HISTORY',
    history
})

export const updateStepNumber = stepNumber => ({
    type: 'UPDATE_STEP_NUMBER',
    stepNumber,
})

export const updatePlayer = player => ({
    type: 'UPDATE_PLAYER',
    player,
})

