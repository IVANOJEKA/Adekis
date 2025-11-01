class FinanceEntry(Base):
    __tablename__ = "finance_entries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
