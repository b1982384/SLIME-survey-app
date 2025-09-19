

questions = [] # text or number
questionst_to_factors = {} # factor number + questions]factors = {} # factor number +  of questions
questions_to_weightings = {} # question number, then like what the highest score should be for maximu weighitng based on factor (previous dict) 
responses = [] # index + 1 = question, value at index = responnse (1-7 for 7 point or 1-5 for 5 poitn)
five_points = set() # set of all the 5 point questions 
seven_points = set() # set of all the 8 point questions 

factor_scores = {} # score 1,2,3,4,5,6,7,8 and default score of 0
.....
for i in range(len(responses)):
    question_num = 8
    answer_weight = responses[i]

    
    if i in five_points:
        factor = questionst_to_factors[i]
        factor_scores[factor] += responses[i] # some standardized score to equalize 5 and 7 point
    if i in seven_points:
        factor = questionst_to_factors[i]
        factor_scores[factor] += responses[i]


return max(factor_scores.values())

