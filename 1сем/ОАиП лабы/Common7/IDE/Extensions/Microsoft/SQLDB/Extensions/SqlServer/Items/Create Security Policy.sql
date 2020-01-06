CREATE SECURITY POLICY [$rawname$]
ADD FILTER PREDICATE [$SomeSchema$].[$SomeFilterPredicate$]([$SomePredicateParameter$]) ON [$SomeSchema$].[$UnknownTablePlaceholder$],
ADD BLOCK PREDICATE [$SomeSchema$].[$SomeBlockPredicate$]([$SomePredicateParameter$]) ON [$SomeSchema$].[$UnknownTablePlaceholder$]
WITH (STATE = ON, SCHEMABINDING = ON)